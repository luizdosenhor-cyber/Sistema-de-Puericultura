import React, { useState, useMemo, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Child, ConsultationStatus } from '../types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PhotoIcon, TableCellsIcon } from './icons/Icons';

const getAgeInMonths = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = (today.getFullYear() - birthDate.getFullYear()) * 12;
    age -= birthDate.getMonth();
    age += today.getMonth();
    return age <= 0 ? 0 : age;
};

const StatCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

const Reports: React.FC = () => {
    const { state } = useAppContext();
    const { children, healthAgents } = state;
    const reportRef = useRef<HTMLDivElement>(null);
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // State for filters
    const [ageGroupFilter, setAgeGroupFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');
    const [acsFilter, setAcsFilter] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const reportData = useMemo(() => {
        const today = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(today.getMonth() - 12);
        
        const monthStart = new Date(selectedYear, selectedMonth - 1, 1);
        const monthEnd = new Date(selectedYear, selectedMonth, 0);

        // 1. Filter children based on UI filters
        const filteredChildren = children.filter(child => {
            const ageMonths = getAgeInMonths(child.dateOfBirth);
            const matchesAge = ageGroupFilter === 'all' ||
                (ageGroupFilter === '0-6' && ageMonths <= 6) ||
                (ageGroupFilter === '6-12' && ageMonths > 6 && ageMonths <= 12) ||
                (ageGroupFilter === '12-24' && ageMonths > 12 && ageMonths <= 24);
            const matchesGender = genderFilter === 'all' || child.sex === genderFilter;
            const matchesAcs = acsFilter === 'all' || child.acsId === acsFilter;
            return matchesAge && matchesGender && matchesAcs;
        });

        const allConsultations = filteredChildren.flatMap(c => c.consultations.map(cons => ({...cons, child: c})));

        // 2. Calculate stats
        const ageGroupStats = {
            '0-6': filteredChildren.filter(c => getAgeInMonths(c.dateOfBirth) <= 6).length,
            '6-12': filteredChildren.filter(c => getAgeInMonths(c.dateOfBirth) > 6 && getAgeInMonths(c.dateOfBirth) <= 12).length,
            '12-24': filteredChildren.filter(c => getAgeInMonths(c.dateOfBirth) > 12 && getAgeInMonths(c.dateOfBirth) <= 24).length,
        };

        const scheduleStats = {
            realizadas: 0,
            atrasadas: 0,
            pendentes: 0,
        };
        
        allConsultations.forEach(c => {
            if (c.status === ConsultationStatus.Realizado) {
                scheduleStats.realizadas++;
                if (c.performedDate && new Date(c.performedDate) > new Date(c.scheduledDate)) {
                    scheduleStats.atrasadas++;
                }
            } else if (new Date(c.scheduledDate) < today) {
                scheduleStats.pendentes++;
            }
        });

        // 3. Last 12 months report
        const last12MonthsConsultations = allConsultations.filter(c => new Date(c.scheduledDate) >= twelveMonthsAgo && new Date(c.scheduledDate) <= today);
        const last12MonthsStats = {
            previstas: last12MonthsConsultations.length,
            realizadas: last12MonthsConsultations.filter(c => c.status === ConsultationStatus.Realizado).length,
            pendentes: last12MonthsConsultations.filter(c => c.status !== ConsultationStatus.Realizado && new Date(c.scheduledDate) < today).length
        };
        
        // 4. Monthly report
        const monthlyConsultations = allConsultations.filter(c => {
            const scheduled = new Date(c.scheduledDate);
            return scheduled >= monthStart && scheduled <= monthEnd;
        });
        const monthlyChildrenIds = new Set(monthlyConsultations.map(c => c.child.id));
        const monthlyStats = {
            criançasPrevistas: monthlyChildrenIds.size,
            realizadas: monthlyConsultations.filter(c => c.status === ConsultationStatus.Realizado).length,
        };

        return { filteredChildren, allConsultations, ageGroupStats, scheduleStats, last12MonthsStats, monthlyStats };

    }, [children, ageGroupFilter, genderFilter, acsFilter, selectedMonth, selectedYear]);

    const ageChartData = [
        { name: '0-6 meses', value: reportData.ageGroupStats['0-6'] },
        { name: '6-12 meses', value: reportData.ageGroupStats['6-12'] },
        { name: '12-24 meses', value: reportData.ageGroupStats['12-24'] },
    ];
    
    const scheduleChartData = [
        { name: 'Realizadas', value: reportData.scheduleStats.realizadas - reportData.scheduleStats.atrasadas },
        { name: 'Com Atraso', value: reportData.scheduleStats.atrasadas },
        { name: 'Pendentes', value: reportData.scheduleStats.pendentes },
    ];

    const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

    const exportToPdf = () => {
        if (!reportRef.current) return;
        
        const header = document.createElement('div');
        header.className = 'p-4 hidden print-header'; 
        const emissionDate = new Date().toLocaleDateString('pt-BR');
        const period = `${new Date(selectedYear, selectedMonth - 1).toLocaleString('pt-BR', {month: 'long', year: 'numeric'})}`;
        
        const filtersApplied = [
            ageGroupFilter !== 'all' ? `Faixa Etária: ${ageGroupFilter} meses` : null,
            genderFilter !== 'all' ? `Sexo: ${genderFilter}` : null,
            acsFilter !== 'all' ? `ACS: ${healthAgents.find(a => a.id === acsFilter)?.name}` : null
        ].filter(Boolean).join(' / ');

        header.innerHTML = `
            <div style="padding: 1rem 2rem; background: white;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 2px solid #EEE;">
                    <div>
                        <h1 style="font-size: 1.5rem; font-weight: bold; color: #1f2937;">Relatório Geral da População Cadastrada</h1>
                        <p style="font-size: 0.875rem; color: #4b5563;">Sistema de Puericultura</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 0.875rem; color: #4b5563;">Período Analisado: ${period}</p>
                        <p style="font-size: 0.875rem; color: #4b5563;">Data de Emissão: ${emissionDate}</p>
                    </div>
                </div>
                ${filtersApplied ? `<p style="font-size: 0.75rem; color: #6b7280; padding-top: 0.5rem;">Filtros: ${filtersApplied}</p>` : ''}
            </div>
        `;
        
        reportRef.current.prepend(header);

        html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`relatorio_geral_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
            reportRef.current?.querySelector('.print-header')?.remove();
        });
    };

    const exportToCsv = () => {
        const headers = ['Criança', 'Data Nasc.', 'Sexo', 'ACS', 'ACS Contato', 'Consulta', 'Data Prevista', 'Data Realizada', 'Status'];
        const rows = reportData.allConsultations.map(c => {
            const acs = healthAgents.find(a => a.id === c.child.acsId);
            let status = c.status;
            if(c.status !== ConsultationStatus.Realizado && new Date(c.scheduledDate) < new Date()){
                status = 'Pendente (Atrasada)' as any;
            } else if (c.status === ConsultationStatus.Realizado && c.performedDate && new Date(c.performedDate) > new Date(c.scheduledDate)){
                status = 'Realizado com Atraso' as any;
            }

            return [
                `"${c.child.name}"`,
                c.child.dateOfBirth,
                c.child.sex,
                `"${acs?.name || 'N/A'}"`,
                `"${acs?.contact || 'N/A'}"`,
                c.milestone,
                c.scheduledDate,
                c.performedDate || '',
                status
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "relatorio_consultas.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Relatórios Gerenciais</h2>
                    <p className="mt-1 text-sm text-gray-500">Análise de dados da população infantil e agendamentos.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-3">
                    <button onClick={exportToPdf} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        Exportar PDF
                    </button>
                     <button onClick={exportToCsv} className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">
                        <TableCellsIcon className="h-5 w-5 mr-2" />
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label htmlFor="age-filter" className="block text-sm font-medium text-gray-700">Faixa Etária</label>
                    <select id="age-filter" value={ageGroupFilter} onChange={e => setAgeGroupFilter(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="all">Todas</option>
                        <option value="0-6">0 a 6 meses</option>
                        <option value="6-12">6 a 12 meses</option>
                        <option value="12-24">12 a 24 meses</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="gender-filter" className="block text-sm font-medium text-gray-700">Sexo</label>
                    <select id="gender-filter" value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="all">Todos</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="acs-filter" className="block text-sm font-medium text-gray-700">Agente de Saúde</label>
                    <select id="acs-filter" value={acsFilter} onChange={e => setAcsFilter(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="all">Todos</option>
                        {healthAgents.map(acs => <option key={acs.id} value={acs.id}>{acs.name}</option>)}
                    </select>
                </div>
            </div>

            <div ref={reportRef} className="space-y-6">
                <div className="bg-white p-4 rounded-lg">
                     {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="População Filtrada" value={reportData.filteredChildren.length} description="Total de crianças" />
                        <StatCard title="Consultas Realizadas" value={reportData.scheduleStats.realizadas} description="Total no período" />
                        <StatCard title="Realizadas com Atraso" value={reportData.scheduleStats.atrasadas} description="Total no período" />
                        <StatCard title="Consultas Pendentes" value={reportData.scheduleStats.pendentes} description="Agendamentos passados" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 mt-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 text-center">População por Faixa Etária</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ageChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 text-center">Status das Consultas</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={scheduleChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {scheduleChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Period Reports */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 mt-4">
                        <div className="bg-white p-5 rounded-lg shadow-md border">
                            <h3 className="font-semibold text-gray-800 mb-4">Panorama (Últimos 12 Meses)</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-gray-600">Total Previstas:</span> <span className="font-medium">{reportData.last12MonthsStats.previstas}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Total Realizadas:</span> <span className="font-medium text-green-600">{reportData.last12MonthsStats.realizadas}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Total Pendentes:</span> <span className="font-medium text-red-600">{reportData.last12MonthsStats.pendentes}</span></div>
                                <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold text-gray-700">Taxa de Realização:</span> <span className="font-bold text-primary-600">{reportData.last12MonthsStats.previstas > 0 ? ((reportData.last12MonthsStats.realizadas / reportData.last12MonthsStats.previstas) * 100).toFixed(1) : 0}%</span></div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-md border">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800">Desempenho Mensal</h3>
                                <div className="flex space-x-2">
                                    <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                                        {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(0, m-1).toLocaleString('pt-BR', {month: 'long'})}</option>)}
                                    </select>
                                    <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                                        {Array.from({length: 5}, (_, i) => currentYear - i).map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                             <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-gray-600">Crianças com Agenda no Mês:</span> <span className="font-medium">{reportData.monthlyStats.criançasPrevistas}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Consultas Realizadas no Mês:</span> <span className="font-medium text-green-600">{reportData.monthlyStats.realizadas}</span></div>
                                 <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold text-gray-700">Diferença (Previsto vs Realizado):</span> <span className="font-bold text-red-600">{reportData.monthlyStats.criançasPrevistas - reportData.monthlyStats.realizadas}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;