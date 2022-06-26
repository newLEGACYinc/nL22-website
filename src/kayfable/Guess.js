function Guess(props) {
    return (
        <tr>
            {props.evaluations.Name === 1 ?
                <th className='!bg-green-500 !w-3/5'>{props.guess.name}</th> :
                <th className='!bg-white !w-3/5'>{props.guess.name}</th>}
            {
                props.evaluations.Gender === 1 ?
                    <td className="!bg-green-500">{props.guess.gender.charAt(0).toUpperCase() + props.guess.gender.slice(1)}</td> :
                    <td className="!bg-white">{props.guess.gender.charAt(0).toUpperCase() + props.guess.gender.slice(1)}</td>
            }
            {props.evaluations.Age === 1 ?
                <td className='!bg-green-500'>{props.guess.age}</td> : <>{
                    props.evaluations.Age === 2 ?
                        <td className='!bg-yellow-300'>
                            {props.guess.age} {props.hardMode ? "" : `${props.evaluations.Age_HOL === 1 ? "▲" : props.evaluations.Age_HOL === 2 ? "▼" : ""}`}
                        </td> :
                        <>{
                            props.evaluations.Age === 3 ?
                                <td className='!bg-orange-400'>{props.guess.age}</td> :
                                <td className="!bg-white">{props.guess.age} {props.hardMode ? "" : `${props.evaluations.Age_HOL === 1 ? "▲" : props.evaluations.Age_HOL === 2 ? "▼" : ""}`}</td>
                        }</>
                }</>
            }
            {
                props.evaluations.Country === 1 ?
                    <td className='!bg-green-500'>{props.guess.birth_place}</td> :
                    <td className="!bg-white">{props.guess.birth_place}</td>
            }
            {
                props.evaluations.Debut === 1 ?
                    <td className='!bg-green-500'>{props.guess.debut_year}</td> : <>{
                        props.evaluations.Debut === 2 ?
                            <td className='!bg-yellow-300'>
                                {props.guess.debut_year} {props.hardMode ? "" : `${props.evaluations.Debut_HOL === 1 ? "▲" : props.evaluations.Debut_HOL === 2 ? "▼" : ""}`}
                            </td> :
                            <>{
                                props.evaluations.Debut === 3 ?
                                    <td className='!bg-orange-400'>{props.guess.debut_year}</td> :
                                    <td className="!bg-white">{props.guess.debut_year} {props.hardMode ? "" : `${props.evaluations.Debut_HOL === 1 ? "▲" : props.evaluations.Debut_HOL === 2 ? "▼" : ""}`}</td>
                            }</>
                    }</>
            }
            {
                props.evaluations.Height === 1 ?
                    <td className='!bg-green-500'>{props.guess.height}</td> : <>{
                        props.evaluations.Height === 2 ?
                            <td className='!bg-yellow-300'>
                                {props.guess.height} {props.hardMode ? "" : `${props.evaluations.Height_HOL === 1 ? "▲" : props.evaluations.Height_HOL === 2 ? "▼" : ""}`}
                            </td> :
                            <>{
                                props.evaluations.Height === 3 ?
                                    <td className='!bg-orange-400'>{props.guess.height}</td> :
                                    <td className="!bg-white">{props.guess.height} {props.hardMode ? "" : `${props.evaluations.Height_HOL === 1 ? "▲" : props.evaluations.Height_HOL === 2 ? "▼" : ""}`}</td>
                            }</>
                    }</>
            }
            {
                props.evaluations.Weight === 1 ?
                    <td className='!bg-green-500'>{props.guess.weight}</td> : <>{
                        props.evaluations.Weight === 2 ?
                            <td className='!bg-yellow-300'>
                                {props.guess.weight} {props.hardMode ? "" : `${props.evaluations.Weight_HOL === 1 ? "▲" : props.evaluations.Weight_HOL === 2 ? "▼" : ""}`}
                            </td> :
                            <>{
                                props.evaluations.Weight === 3 ?
                                    <td className='!bg-orange-400'>{props.guess.weight}</td> :
                                    <td className="!bg-white">{props.guess.weight} {props.hardMode ? "" : `${props.evaluations.Weight_HOL === 1 ? "▲" : props.evaluations.Weight_HOL === 2 ? "▼" : ""}`}</td>
                            }</>
                    }</>
            }
        </tr >

    )
}


export default Guess;