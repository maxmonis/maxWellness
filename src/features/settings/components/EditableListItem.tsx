import { Form } from "@/components/Form"
import { Input } from "@/components/Input"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditableName } from "@/features/settings/utils/models"
import { cn } from "@/lib/utils"
import {
	DotsHorizontalIcon,
	Pencil2Icon,
	PlusCircledIcon,
	TrashIcon,
} from "@radix-ui/react-icons"
import * as React from "react"
import { isSameText } from "../utils/functions"

/**
 * Allows the user to edit or delete a lift/workout name
 */
export function EditableListItem({
	editableName,
	editableNameList,
	updateOptions,
}: {
	editableName: EditableName
	editableNameList: Array<EditableName>
	updateOptions: (newValue: EditableName) => void
}) {
	const [newText, setNewText] = React.useState(editableName.text)
	const [editing, setEditing] = React.useState(false)

	const isDuplicate = editableNameList.some(
		name => isSameText(name.text, newText) && name.id !== editableName.id,
	)
	const canDelete = editableNameList.filter(n => !n.deleted).length > 1

	return (
		<li className="mt-1 flex items-center justify-between gap-4">
			{editing ? (
				<Form className="my-1 w-full" onSubmit={handleSubmit}>
					<Input
						autoFocus
						className="px-1"
						id="newText"
						name="newText"
						onBlur={handleSubmit}
						placeholder={newText}
						value={newText}
						{...{ onChange, onKeyUp }}
					/>
					{newText !== editableName.text && (
						<div className="mb-2 flex justify-center">
							{newText ? (
								<Button className="mt-3 w-fit" type="submit" variant="outline">
									Update Name
								</Button>
							) : (
								<Button
									className="mt-3 w-fit"
									type="submit"
									variant="destructive"
								>
									Delete Name
								</Button>
							)}
						</div>
					)}
				</Form>
			) : (
				<div className="flex w-full items-center justify-between">
					<p
						className={cn(
							"leading-tight",
							editableName.deleted && "line-through",
							newText.split(" ").some(word => word.length >= 15) && "break-all",
						)}
						onClick={() => {
							setEditing(true)
						}}
						translate="no"
					>
						{newText}
					</p>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="-mb-2 mr-px" size="icon" variant="ghost">
								<span className="sr-only">Open {editableName.text} menu</span>
								<DotsHorizontalIcon className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>{editableName.text}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="flex gap-1.5"
								onClick={() => {
									setEditing(true)
								}}
							>
								<Pencil2Icon />
								Edit
							</DropdownMenuItem>
							{((canDelete && !editableName.deleted) ||
								editableName.deleted) && (
								<DropdownMenuItem
									className="flex gap-1.5"
									onClick={onDeleteClick}
								>
									{editableName.deleted ? <PlusCircledIcon /> : <TrashIcon />}
									{editableName.deleted ? "Restore" : "Delete"}
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}
		</li>
	)

	/**
	 * Handles form updates, sanitizing the value
	 */
	function onChange({
		target: { value },
	}: React.ChangeEvent<HTMLInputElement>) {
		if (!value || /^[A-Za-z ]+$/.test(value)) {
			setNewText(value.trimStart().replace(/\s/, " "))
		}
	}

	/**
	 * Cancels editing if the user presses the escape key
	 */
	function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Escape") {
			setEditing(false)
			setNewText(editableName.text)
		}
	}

	/**
	 * Attempts to save the user's changes
	 */
	function handleSubmit() {
		if (isDuplicate) {
			setNewText(editableName.text)
		} else if (!newText.trim()) {
			handleDelete()
		} else {
			updateOptions({ ...editableName, text: newText.trim() })
		}
		setEditing(false)
	}

	/**
	 * Deletes the name (if allowed)
	 */
	function handleDelete() {
		if (editableNameList.length > 1) {
			updateOptions({ ...editableName, deleted: true })
		} else {
			handleReset()
		}
	}

	/**
	 * Updates whether a name is hidden (if possible)
	 */
	function onDeleteClick() {
		updateOptions({ ...editableName, deleted: !editableName.deleted })
	}

	/**
	 * Resets the component
	 */
	function handleReset() {
		setEditing(false)
		setNewText(editableName.text)
	}
}
