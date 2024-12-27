import { ButtonHTMLAttributes } from "react"

export const Button = (buttonProp: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
    return (
        <div>
            <button {...buttonProp} className={`bg-blue-500 text-white p-2 rounded-md inline-block ${buttonProp.className}`}>
                {buttonProp.children}
            </button>
        </div>
    )
}