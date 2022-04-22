import './modal.css';

import { FiX } from 'react-icons/fi';

export default function Modal({ content, close }){
    return(
        <div className="modal">
            <div className="container">
                <button onClick={close} className="close">
                    <FiX size={23} color="#fff"/>
                    Return
                </button>

                <div>
                    <h2>Call details</h2>

                    <div className="row">
                        <span>
                            Custumer: <a>{content.custumer}</a>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Subject: <a>{content.subject}</a>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Created at: <a>{content.createdFormated}</a>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            State: <a style={{ color: '#fff', backgroundColor: content.state === 'Opened' ? '#5cb85c' : '#999' }}>{content.state}</a>
                        </span>
                    </div>

                    {content.complement !== '' && (
                        <>
                            <h3>Complement</h3>
                            <p>{content.complement}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}