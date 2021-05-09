import React from 'react';
import { BsXCircle } from 'react-icons/bs';

function VerifyEmail({ handleClick }) {
  return (
    <div className="verify-email">
      <BsXCircle style={{ visibility: 'hidden' }} /> Ваш e-mail не подтвержден!
      <BsXCircle style={{ cursor: 'pointer' }} onClick={handleClick} />
    </div>
  );
}

export default VerifyEmail;
