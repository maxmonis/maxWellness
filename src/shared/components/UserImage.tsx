import {faUser} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import Image from "next/image"
import React from "react"
import {uploadImage} from "~/firebase/client"
import {useSession} from "../hooks/useSession"
import {useUpdateImage} from "../hooks/useUpdateImage"

export function UserImage({editable = false}) {
  const {data: session} = useSession()
  const [newUrl, setNewUrl] = React.useState("")
  const {mutate: updateImage} = useUpdateImage()
  const [uploading, setUploading] = React.useState(false)

  if (!session) return <></>

  const {photoURL, userId, userName} = session.profile
  const src = newUrl || photoURL

  return (
    <div
      className={classNames(
        "relative flex items-center",
        src && (editable ? "h-12 w-12" : "h-8 w-8"),
      )}
    >
      {uploading ? (
        <span
          aria-busy="true"
          className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-r-transparent"
          role="alert"
        />
      ) : src ? (
        <Image
          alt={`${userName} profile photo`}
          className="flex flex-shrink-0 rounded-full border border-slate-700 object-cover"
          fill
          sizes="10rem"
          priority
          {...{src}}
        />
      ) : (
        <FontAwesomeIcon icon={faUser} size={editable ? "2xl" : "lg"} />
      )}
      {editable && (
        <input
          className="absolute left-0 top-0 opacity-0"
          onChange={async e => {
            const file = e.target.files?.[0]
            if (uploading || !file) return
            setUploading(true)
            try {
              const url = await uploadImage(
                file,
                `profile/${userId}/${file.name}`,
              )
              setNewUrl(url)
              updateImage(url)
            } finally {
              setUploading(false)
            }
          }}
          title={(src ? "Update" : "Upload") + " profile photo"}
          type="file"
        />
      )}
    </div>
  )
}
