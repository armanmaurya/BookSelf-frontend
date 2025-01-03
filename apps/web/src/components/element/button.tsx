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

export const FloatingBtn = (props: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
    return (
        <button {...props} className={`absolute flex items-center  p-2 text-white rounded-lg ${props.className}`}>
            {props.children}
        </button>

    )
}

// export cosnt YourProfileBtn()