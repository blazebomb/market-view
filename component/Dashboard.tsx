'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

type StockData = {
  date: string | Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type Company = {
  id: string
  name: string
  stockData: StockData[]
}

type Props = {
  companies: Company[]
}

export default function StockDashboard({ companies }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCompanyId = searchParams.get('companyId') || companies[0]?.id
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)
  const dataPoints = selectedCompany?.stockData || []

  const average = dataPoints.reduce((sum, item) => sum + item.close, 0) / (dataPoints.length || 1)

  const chartData = {
    labels: dataPoints.map((d) =>
      typeof d.date === 'string' ? d.date.split('T')[0] : d.date.toISOString().split('T')[0]
    ),
    datasets: [
      {
        label: 'Close Price',
        data: dataPoints.map((d) => d.close),
        borderColor: '#f97316', // orange-500
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#f97316',
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const handleCompanyClick = (id: string) => {
    router.push(`/?companyId=${id}`)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (mobileMenuOpen && !target.closest('.mobile-menu')) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div className="md:hidden bg-gray-900 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Stock Dashboard</h2>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div
        className={`mobile-menu ${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-gray-900 text-white p-4 overflow-y-auto fixed md:relative h-full z-50`}
      >
        <h2 className="text-xl font-bold mb-6 hidden md:block">Companies</h2>
        <div className="space-y-2">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => handleCompanyClick(company.id)}
              className={`block w-full text-left p-3 rounded-lg transition-colors ${
                selectedCompanyId === company.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {company.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {selectedCompany ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedCompany.name}
              </h2>
              <p className="text-gray-600 mb-6">Stock Performance Overview</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Average Price</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{average.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-800">{dataPoints.length}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <p className="text-sm text-orange-600 font-medium">Latest Close</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{dataPoints[dataPoints.length - 1]?.close.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="h-80 md:h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Additional data table could go here */}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-700">No company selected.</p>
          </div>
        )}
      </div>
    </div>
  )
}