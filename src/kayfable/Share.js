function Share(props) {

    function getEvalNumbers(guess) {
        const allowed = ["Name", "Gender", "Age", "Country", "Debut", "Height", "Weight"]
        const filtered = Object.keys(guess)
            .filter(key => allowed.includes(key))
            .reduce((obj, key) => {
                obj[key] = guess[key];
                return obj;
            }, {});
        var arrayObject = Object.values(filtered)
        return arrayObject;
    }

    function generateGrid(evaluations) {
        return evaluations.map((evaluation) => {
            let status = getEvalNumbers(evaluation);
            console.log(status)
            return status.map((value) => {
                    switch (value) {
                        case 1:
                            return '🟩'
                        case 2:
                            return '🟨'
                        case 3:
                            return '🟧'
                        case 0:
                            return '⬜'
                        default:
                            return '⬜'

                    }
                })
                .join('')
        })
            .join('\n')
    }

    function getDate(answer) {
        return answer.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
    }

    function getResultText() {
        return(
            "Kayfable " + getDate(props.answer.game_id) +
            " - " +
            `${props.result === "LOSE" ? 'X' : props.evaluations.length}` +
            "/10" + `${props.hardMode && "*"}\n\n` +
            generateGrid(props.evaluations)
        )
    }

    return (
        <div>
            {props.result &&
                <div>
                    <button onClick={() => { navigator.clipboard.writeText(getResultText()); }}>Share</button>
                </div>
            }
        </div>
    )

}

export default Share;