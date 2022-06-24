function Guess(props) {
    return (
        <tr>
            {props.evaluations.Name === 1 ?
                <th style={{ background: "#00ff2b", width: "20%" }}>{props.guess.name}</th> :
                <th style={{ background: "#fff", width: "20%" }}>{props.guess.name}</th>}
            {
                props.evaluations.Gender === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.gender}</td> :
                    <td style={{ background: "#fff" }}>{props.guess.gender}</td>
            }
            {props.evaluations.Age === 1 ?
                <td style={{ background: "#00ff2b" }}>{props.guess.age}</td> : <>{
                    props.evaluations.Age === 2 ?
                        <td style={{ background: "#FFFF00" }}>
                            {props.guess.age} {props.hardMode ? "" : `${props.evaluations.Age_HOL === 1 ? "▲" : props.evaluations.Age_HOL === 2 ? "▼" : ""}`}
                        </td> :
                        <>{
                            props.evaluations.Age === 3 ?
                                <td style={{ background: "#FFA500" }}>{props.guess.age}</td> :
                                <td style={{ background: "#fff" }}>{props.guess.age} {props.hardMode ? "" : `${props.evaluations.Age_HOL === 1 ? "▲" : props.evaluations.Age_HOL === 2 ? "▼" : ""}`}</td>
                        }</>
                }</>
            }
            {
                props.evaluations.Country === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.birth_place}</td> :
                    <td style={{ background: "#fff" }}>{props.guess.birth_place}</td>
            }
            {
                props.evaluations.Debut === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.debut_year}</td> : <>{
                        props.evaluations.Debut === 2 ?
                            <td style={{ background: "#FFFF00" }}>
                                {props.guess.debut_year} {props.hardMode ? "" : `${props.evaluations.Debut_HOL === 1 ? "▲" : props.evaluations.Debut_HOL === 2 ? "▼" : ""}`}
                            </td> :
                            <>{
                                props.evaluations.Debut === 3 ?
                                    <td style={{ background: "#FFA500" }}>{props.guess.debut_year}</td> :
                                    <td style={{ background: "#fff" }}>{props.guess.debut_year} {props.hardMode ? "" : `${props.evaluations.Debut_HOL === 1 ? "▲" : props.evaluations.Debut_HOL === 2 ? "▼" : ""}`}</td>
                            }</>
                    }</>
            }
            {
                props.evaluations.Height === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.height}</td> : <>{
                        props.evaluations.Height === 2 ?
                            <td style={{ background: "#FFFF00" }}>
                                {props.guess.height} {props.hardMode ? "" : `${props.evaluations.Height_HOL === 1 ? "▲" : props.evaluations.Height_HOL === 2 ? "▼" : ""}`}
                            </td> :
                            <>{
                                props.evaluations.Height === 3 ?
                                    <td style={{ background: "#FFA500" }}>{props.guess.height}</td> :
                                    <td style={{ background: "#fff" }}>{props.guess.height} {props.hardMode ? "" : `${props.evaluations.Height_HOL === 1 ? "▲" : props.evaluations.Height_HOL === 2 ? "▼" : ""}`}</td>
                            }</>
                    }</>
            }
            {
                props.evaluations.Weight === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.weight}</td> : <>{
                        props.evaluations.Weight === 2 ?
                            <td style={{ background: "#FFFF00" }}>
                                {props.guess.weight} {props.hardMode ? "" : `${props.evaluations.Weight_HOL === 1 ? "▲" : props.evaluations.Weight_HOL === 2 ? "▼" : ""}`}
                            </td> :
                            <>{
                                props.evaluations.Weight === 3 ?
                                    <td style={{ background: "#FFA500" }}>{props.guess.weight}</td> :
                                    <td style={{ background: "#fff" }}>{props.guess.weight} {props.hardMode ? "" : `${props.evaluations.Weight_HOL === 1 ? "▲" : props.evaluations.Weight_HOL === 2 ? "▼" : ""}`}</td>
                            }</>
                    }</>
            }
        </tr >

    )
}


export default Guess;