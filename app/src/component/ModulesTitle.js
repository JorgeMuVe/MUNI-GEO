import React from 'react';

export class ModulesTitle extends React.Component {
    constructor(props, a) {
        super(props);
        this.state = {
            msg : a, 
        };
    }

    previousPage = () => {
        window.history.back();
    }

    render() {
        // console.log( this.state.msg );   style={{border:'1px solid red'}}
        return (
            <div>
                <br />
                <div className="t3">
                    <span onClick={this.previousPage}>    
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0, 0, 20, 20">
                            <path d="M14.333 0l-10 10 10 10 1.334-1.333L7 10l8.667-8.667L14.333 0z" />
                        </svg>
                    </span>&nbsp;
                    <span>{this.props.text}</span>
                </div>
            </div>
        )
    }
}

export default ModulesTitle;