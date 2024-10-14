import { useSession } from "../hooks/useSession"

export type Session = NonNullable<ReturnType<typeof useSession>["session"]>
