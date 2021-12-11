import * as React from 'react';
import { Route, Routes, } from 'react-router-dom';
import Invoices from '../pages/invoices/Invoices';

export default function MyRouter(props) {
  const { user } = props;
  return (
    <Routes>
      <Route path="/invoices" element={<Invoices user={user} />} />
      <Route path="/drafts" element={<p> DRAFTS </p>} />
      <Route path="/trash" element={<p> TRASH </p>} />
      <Route path="/spam" element={<p> SPAM </p>} />
    </Routes>
  );
}
