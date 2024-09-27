import {faUser} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import Image from "next/image"
import React from "react"
import {storage} from "~/firebase/client"
import {useSession} from "../hooks/useSession"
import {useUpdateImage} from "../hooks/useUpdateImage"

export function UserImage({editable}: {editable?: boolean}) {
  const {data: session} = useSession()
  const [newUrl, setNewUrl] = React.useState("")
  const photoURL = newUrl || session?.profile.photoURL
  const {mutate: updateImage} = useUpdateImage()
  const [uploading, setUploading] = React.useState(false)

  return (
    <div
      className={classNames(
        "relative flex flex-shrink-0",
        editable ? "h-12 w-12" : "h-7 w-7",
      )}
      {...(editable && {
        title: (photoURL ? "Update" : "Upload") + " profile photo",
      })}
    >
      {uploading ? (
        <span
          aria-busy="true"
          className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-r-transparent"
          role="alert"
        />
      ) : photoURL ? (
        <Image
          alt={`${session?.profile.userName} profile photo`}
          className="flex flex-shrink-0 rounded-full border border-slate-700 object-cover"
          fill
          priority
          src={photoURL}
        />
      ) : (
        <FontAwesomeIcon icon={faUser} size="lg" />
      )}
      {editable && (
        <input
          className="absolute opacity-0"
          onChange={async e => {
            const file = e.target.files?.[0]
            if (uploading || !file) return
            setUploading(true)
            const storageRef = ref(storage, `images/${file.name}`)
            try {
              await uploadBytes(storageRef, file)
              const url = await getDownloadURL(storageRef)
              setNewUrl(url)
              updateImage(url)
            } finally {
              setUploading(false)
            }
          }}
          type="file"
        />
      )}
    </div>
  )
}
