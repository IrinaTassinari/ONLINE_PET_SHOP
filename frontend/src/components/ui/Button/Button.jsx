import style from './Button.module.css'

function Button({children, onClick, disabled}){
    return(
        <button 
            className={style.btnBlue}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
export default Button



/**
    лучше предать {children} чем {text}
        Почему это лучше:
        -можно передавать не только текст, но и:
        -иконки
        -<span>
        -разметку
    кнопка становится универсальной
 */