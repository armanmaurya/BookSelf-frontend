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
        <button {...props} className={`absolute flex items-center bottom-5 right-6 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 ${props.className}`}>
            {props.children}
        </button>

    )
}

// export cosnt YourProfileBtn()