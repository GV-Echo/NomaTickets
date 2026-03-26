declare module 'eventsApp/EventsApp' {
  // @ts-ignore
  import type { AuthContextValue } from './types/auth.types'
  interface EventsAppProps {
    authValue?: AuthContextValue
  }
  const EventsApp: React.ComponentType<EventsAppProps>
  export default EventsApp
}

declare module 'adminApp/AdminApp' {
  // @ts-ignore
  import type { AuthContextValue } from './types/auth.types'
  interface AdminAppProps {
    authValue?: AuthContextValue
  }
  const AdminApp: React.ComponentType<AdminAppProps>
  export default AdminApp
}
