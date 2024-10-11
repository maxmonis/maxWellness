interface FormProps
	extends Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit"> {
	onSubmit: () => void | Promise<void>
}

export function Form({ children, onSubmit, ...props }: FormProps) {
	return (
		<form
			noValidate
			onSubmit={e => {
				e.preventDefault()
				onSubmit()
			}}
			{...props}
		>
			{children}
		</form>
	)
}
