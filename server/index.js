import express from 'express'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const dataDir = path.join(rootDir, 'src', 'lib', 'data')
const storageDir = path.join(rootDir, 'storage')
const contentPath = path.join(dataDir, 'content.json')
const projectsPath = path.join(dataDir, 'projects.json')

const ALLOWED_EXT = ['.pdf', '.ipynb', '.md']

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const id = req.params.id
    const dir = path.join(storageDir, 'projects', String(id))
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (_req, file, cb) => {
    const base = path.basename(file.originalname, path.extname(file.originalname))
    const ext = path.extname(file.originalname).toLowerCase()
    const safe = base.replace(/[^a-zA-Z0-9_-]/g, '_')
    cb(null, `${safe}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ALLOWED_EXT.includes(ext)) return cb(null, true)
    cb(new Error('Dozwolone tylko pliki .pdf, .ipynb, .md'))
  },
})

const app = express()
app.use(express.json({ limit: '2mb' }))
app.use('/storage', express.static(storageDir))

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.options('/api/*', (_req, res) => res.sendStatus(204))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, dataDir, contentExists: fs.existsSync(contentPath), projectsExists: fs.existsSync(projectsPath) })
})

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('[readJson]', filePath, err.message)
    return null
  }
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const str = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  fs.writeFileSync(filePath, str, 'utf-8')
}

app.get('/api/content', (_req, res) => {
  try {
    const data = readJson(contentPath)
    if (data == null) {
      res.status(404).json({ error: 'content.json not found' })
      return
    }
    res.json(data)
  } catch (err) {
    console.error('[GET /api/content]', err.message)
    res.status(500).json({ error: String(err.message) })
  }
})

app.post('/api/content', (req, res) => {
  try {
    if (req.body == null || typeof req.body !== 'object' || Array.isArray(req.body)) {
      res.status(400).json({ error: 'Body must be a content object' })
      return
    }
    writeJson(contentPath, req.body)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[POST /api/content]', err.message)
    res.status(500).json({ error: String(err.message) })
  }
})

app.get('/api/projects', (_req, res) => {
  try {
    const data = readJson(projectsPath)
    if (data == null) {
      res.status(404).json({ error: 'projects.json not found' })
      return
    }
    res.json(data)
  } catch (err) {
    console.error('[GET /api/projects]', err.message)
    res.status(500).json({ error: String(err.message) })
  }
})

app.post('/api/projects', (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      res.status(400).json({ error: 'Body must be an array' })
      return
    }
    writeJson(projectsPath, req.body)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[POST /api/projects]', err.message)
    res.status(500).json({ error: String(err.message) })
  }
})

app.post('/api/projects/:id/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Brak pliku' })
      return
    }
    const relativePath = path.relative(storageDir, req.file.path).replace(/\\/g, '/')
    const ext = path.extname(req.file.originalname).toLowerCase()
    const type = ext === '.pdf' ? 'pdf' : ext === '.ipynb' ? 'ipynb' : 'md'
    res.status(200).json({
      path: `storage/${relativePath}`,
      label: path.basename(req.file.originalname),
      type,
    })
  } catch (err) {
    console.error('[POST /api/projects/:id/upload]', err.message)
    res.status(500).json({ error: String(err.message) })
  }
})

app.delete('/api/storage/file', (req, res) => {
  try {
    const filePath = req.query.path
    if (typeof filePath !== 'string' || !filePath.startsWith('storage/')) {
      res.status(400).json({ error: 'Nieprawidłowa ścieżka' })
      return
    }
    const fullPath = path.join(rootDir, filePath)
    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ error: 'Plik nie istnieje' })
      return
    }
    fs.unlinkSync(fullPath)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/storage/file]', err.message)
    res.status(500).json({ error: String(err.message) })
  }
})

const PORT = Number(process.env.PORT) || 3001
app.listen(PORT, () => {
  console.log(`Data API listening on http://localhost:${PORT}`)
})
