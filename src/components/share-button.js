import React from 'react';

function ShareButton({ onClick }) {
    return (
        <button onClick={onClick} className="btn btn-sm btn-success">
            Share
        </button>
    );
}

export default ShareButton;