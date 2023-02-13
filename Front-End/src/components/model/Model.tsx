import './Model.css'
import Enter from '../login/enter/Enter'

const Model = ({title}) => {

    return(
        <div className= 'model-backgrand'>
            <div className='model'>
               <h1>{title}</h1>
               <button className = 'btn'>Singin</button>
               
            </div>
        </div>
    )
}

export default Model