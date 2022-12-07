import * as React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Invoices from '../pages/invoices/Invoices';
import Banks from '../pages/banks/Banks';
import Companies from '../pages/companies/Companies';
import Trades from '../pages/trades/Trades';
import RecurringBills from '../pages/recurringBills/RecurringBills';
import SignIn from '../Authentification/SignIn';

export default function MyRouter(props) {
  const { user, setUser } = props;
  const location = useLocation();

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route path="/login" element={<SignIn user={user} setUser={setUser} />}/>
      <Route path="/invoices" element={<Invoices user={user} />} />
      <Route path="/recurringbills" element={<RecurringBills user={user} />} />
      <Route path="/banks" element={<Banks user={user} />} />
      <Route path="/companies" element={<Companies user={user} />} />
      <Route path="/trades" element={<Trades user={user} />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
