import * as React from 'react';
import { Route, Routes, } from 'react-router-dom';
import Invoices from '../pages/invoices/Invoices';
import Banks from '../pages/banks/Banks';
import Companies from '../pages/companies/Companies';

export default function MyRouter(props) {
  const { user } = props;
  return (
    <Routes>
      <Route path="/invoices" element={<Invoices user={user} />} />
      <Route path="/banks" element={<Banks user={user} />} />
      <Route path="/companies" element={<Companies user={user} />} />
      <Route path="/spam" element={<p> SPAM </p>} />
    </Routes>
  );
}
