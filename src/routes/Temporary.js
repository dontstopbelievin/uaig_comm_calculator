import React from 'react';

export default class Temporary extends React.Component {

  componentDidMount() {
    this.props.breadCrumbs();
  }

  componentWillUnmount() {
    //console.log("CitizenComponent will unmount");
  }

  render() {
    //console.log("rendering the CitizenComponent");
    return (
      <div className="content container">
        <div className="alert alert-danger">
          <strong>Danger!</strong> <h4>Ваши функции отключены администратором.</h4>
        </div>
      </div>
    )
  }
}