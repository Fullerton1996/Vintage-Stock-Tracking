import React, { useMemo } from 'react';
import { LingerieItem, ItemStatus } from '../types';

interface FinancialSummaryProps {
  items: LingerieItem[];
}

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-sm font-semibold text-brand-charcoal/60 uppercase tracking-wider">{title}</h3>
    <p className={`text-3xl font-bold font-serif ${color}`}>{value}</p>
  </div>
);

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ items }) => {
  const summary = useMemo(() => {
    const totalCost = items.reduce((acc, item) => acc + item.cost, 0);
    const potentialRevenue = items
      .filter(item => item.status === ItemStatus.IN_STOCK)
      .reduce((acc, item) => acc + item.potentialRevenue, 0);
    
    const soldItems = items.filter(item => item.status === ItemStatus.SOLD);
    const totalSoldRevenue = soldItems.reduce((acc, item) => acc + (item.soldPrice || 0), 0);
    const costOfGoodsSold = soldItems.reduce((acc, item) => acc + item.cost, 0);
    const totalProfit = totalSoldRevenue - costOfGoodsSold;

    return { totalCost, potentialRevenue, totalSoldRevenue, totalProfit };
  }, [items]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  return (
    <section className="mb-10">
      <h2 className="font-serif text-3xl text-brand-charcoal mb-4">Financial Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inventory Cost" value={formatCurrency(summary.totalCost)} color="text-brand-deep-rose" />
        <StatCard title="Potential Revenue" value={formatCurrency(summary.potentialRevenue)} color="text-brand-rose" />
        <StatCard title="Total Sales" value={formatCurrency(summary.totalSoldRevenue)} color="text-green-600" />
        <StatCard title="Total Profit" value={formatCurrency(summary.totalProfit)} color="text-emerald-700" />
      </div>
    </section>
  );
};

export default FinancialSummary;