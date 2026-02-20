import { ADMIN_PAGE_CONTAINER_CLASS } from '@/lib/constants/layout'

interface AdminPageContainerProps {
  children: React.ReactNode
  className?: string
}

export function AdminPageContainer({ children, className }: AdminPageContainerProps) {
  const classes = className
    ? `${ADMIN_PAGE_CONTAINER_CLASS} ${className}`.trim()
    : ADMIN_PAGE_CONTAINER_CLASS
  return <div className={classes}>{children}</div>
}
