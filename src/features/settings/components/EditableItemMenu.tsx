import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditableName } from "@/utils/models"
import {
	HamburgerMenuIcon,
	MinusCircledIcon,
	Pencil2Icon,
	PlusCircledIcon,
	TrashIcon,
} from "@radix-ui/react-icons"

/**
 * Allows the user to update/hide a name, and also to delete it if it's unused
 */
export function EditableItemMenu({
	canHide,
	editableName: { canDelete, isHidden },
	newText,
	onDeleteClick,
	onEditClick,
	onHideClick,
}: {
	canHide: boolean
	editableName: EditableName
	newText: string
	onDeleteClick: () => void
	onEditClick: () => void
	onHideClick: () => void
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<HamburgerMenuIcon className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem className="flex gap-1.5" onClick={onEditClick}>
					<Pencil2Icon />
					Edit
				</DropdownMenuItem>
				{((canHide && !isHidden) || isHidden) && (
					<DropdownMenuItem className="flex gap-1.5" onClick={onHideClick}>
						{isHidden ? <PlusCircledIcon /> : <MinusCircledIcon />}
						{isHidden ? "Unhide" : "Hide"}
					</DropdownMenuItem>
				)}
				{canDelete && (
					<DropdownMenuItem className="flex gap-1.5" onClick={onDeleteClick}>
						<TrashIcon />
						Delete
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
