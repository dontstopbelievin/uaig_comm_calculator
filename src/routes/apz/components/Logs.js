import React from 'react';

export default class Logs extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div>
            {this.props.state_history && this.props.state_history.length > 0 &&
              <div>
                <h5 className="block-title-2 mb-3 mt-3">Логи</h5>
                <div className="border px-3 py-2">
                  {this.props.state_history.map(function(state, index) {
                    return(
                      <div key={index}>
                        <p className="mb-0">{state.created_at}&emsp;{state.state.name} {state.receiver && state.state_id == 10 &&'('+state.receiver+')'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
      </div>
    )
  }
}
