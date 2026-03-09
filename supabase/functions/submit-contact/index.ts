import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const NAME_MIN = 2
const NAME_MAX = 100
const MESSAGE_MIN = 10
const MESSAGE_MAX = 2000
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

interface Body {
  name?: string
  email?: string
  message?: string
}

function jsonResponse(body: unknown, status: number, headers = corsHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  })
}

function validate(body: Body): string | null {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!name || name.length < NAME_MIN) return 'Imię musi mieć co najmniej 2 znaki.'
  if (name.length > NAME_MAX) return 'Imię nie może przekraczać 100 znaków.'
  if (!email) return 'Email jest wymagany.'
  if (!EMAIL_REGEX.test(email)) return 'Podaj poprawny adres email.'
  if (!message || message.length < MESSAGE_MIN) return 'Wiadomość musi mieć co najmniej 10 znaków.'
  if (message.length > MESSAGE_MAX) return 'Wiadomość nie może przekraczać 2000 znaków.'

  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Metoda dozwolona: POST' }, 405)
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return jsonResponse({ error: 'Nieprawidłowy JSON w body.' }, 400)
  }

  const validationError = validate(body)
  if (validationError) {
    return jsonResponse({ error: validationError }, 400)
  }

  const name = (body.name as string).trim()
  const email = (body.email as string).trim()
  const message = (body.message as string).trim()

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Konfiguracja serwera.' }, 500)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const { data, error } = await supabase
    .from('contact_messages')
    .insert({ name, email, message })
    .select()
    .single()

  if (error) {
    return jsonResponse({ error: error.message }, 400)
  }

  return jsonResponse(data, 200)
})
