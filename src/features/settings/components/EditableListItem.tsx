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
import { cn } from "@/lib/utils"
import { EditableName } from "@/utils/models"
import {
	MinusCircledIcon,
	Pencil2Icon,
	PlusCircledIcon,
	TrashIcon,
} from "@radix-ui/react-icons"
import * as React from "react"
import { isTextAlreadyInList } from "../utils/functions"

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
	updateOptions: (newValue: EditableName, previousValue: EditableName) => void
}) {
	const [newText, setNewText] = React.useState(editableName.text)
	const [editing, setEditing] = React.useState(false)

	const isDuplicate = isTextAlreadyInList(newText, editableNameList)
	const canHide = editableNameList.filter(n => !n.isHidden).length > 1

	return (
		<li className="mt-1 flex items-center justify-between gap-4">
			{editing ? (
				<Form className="w-full" onSubmit={handleSubmit}>
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
							{isDuplicate ? (
								<p className="mt-1 text-center text-red-600 dark:text-red-500">
									Duplicate name
								</p>
							) : newText ? (
								<Button className="mt-3 w-fit" type="submit" variant="outline">
									Update Name
								</Button>
							) : editableName.canDelete ? (
								<Button
									className="mt-3 w-fit"
									type="submit"
									variant="destructive"
								>
									Delete Name
								</Button>
							) : (
								<p className="mt-1 text-center text-sm text-red-600 dark:text-red-500">
									Can&apos;t delete, used in workout(s)
								</p>
							)}
						</div>
					)}
				</Form>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className={cn(
								"flex h-auto w-full justify-start whitespace-normal text-left leading-tight",
								editableName.isHidden && "line-through",
								newText.split(" ").some(word => word.length >= 12) &&
									"break-all",
							)}
							translate="no"
							variant="ghost"
						>
							{newText}
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
						{((canHide && !editableName.isHidden) || editableName.isHidden) && (
							<DropdownMenuItem className="flex gap-1.5" onClick={onHideClick}>
								{editableName.isHidden ? (
									<PlusCircledIcon />
								) : (
									<MinusCircledIcon />
								)}
								{editableName.isHidden ? "Unhide" : "Hide"}
							</DropdownMenuItem>
						)}
						{editableName.canDelete && (
							<DropdownMenuItem className="flex gap-1.5" onClick={handleDelete}>
								<TrashIcon />
								Delete
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
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
			updateOptions({ ...editableName, text: newText.trim() }, editableName)
		}
		setEditing(false)
	}

	/**
	 * Deletes the name (if allowed)
	 */
	function handleDelete() {
		if (editableName.canDelete && editableNameList.length > 1) {
			updateOptions({ ...editableName, text: "" }, editableName)
		} else {
			handleReset()
		}
	}

	/**
	 * Updates whether a name is hidden (if possible)
	 */
	function onHideClick() {
		const newHidden = !editableName.isHidden
		if ((canHide && newHidden) || !newHidden) {
			updateOptions({ ...editableName, isHidden: newHidden }, editableName)
		}
	}

	/**
	 * Resets the component
	 */
	function handleReset() {
		setEditing(false)
		setNewText(editableName.text)
	}
}
