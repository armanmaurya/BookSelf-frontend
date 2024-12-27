import { FormHTMLAttributes } from "react"

export const Form = (formPorp: React.DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) => {
    return (
        <form {...formPorp} className={`border p-3 rounded-md flex flex-col gap-3 ${formPorp.className}`}>
            {formPorp.children}
        </form>
    )
}