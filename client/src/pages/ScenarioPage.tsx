// import React, { useState, useEffect } from 'react'

// interface Scenario {
//     _id: string
//     scenarioName: string
//     description: string
//     scenarioType: 'tariff_change' | 'supplier_change' | 'energy_mix' | 'consumption_optimization'
//     baseTotalAmount: number
//     projectedTotalAmount: number
//     costSavings: number
//     percentageSavings: number
//     annualSavings: number
//     simulationStatus: 'draft' | 'completed' | 'approved'
//     createdDate: string
// }

// interface Bill {
//     _id: string
//     billNumber: string
//     consumerNumber: string
//     billingMonth: string
//     billingYear: number
//     totalAmount: number
// }

// const ScenarioPage: React.FC = () => {
//     const [scenarios, setScenarios] = useState<Scenario[]>([])
//     const [bills, setBills] = useState<Bill[]>([])
//     const [showCreateModal, setShowCreateModal] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [newScenario, setNewScenario] = useState({
//         billId: '',
//         scenarioName: '',
//         description: '',
//         scenarioType: 'tariff_change' as const,
//         newTariffRate: '',
//         newSupplierName: '',
//         newSupplierRate: '',
//         energyMixPercentage: '',
//         consumptionReduction: ''
//     })

//     useEffect(() => {
//         loadScenarios()
//         loadBills()
//     }, [])

//     const loadScenarios = async () => {
//         try {
//             const response = await fetch('/api/v1/scenarios', {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
//             const result = await response.json()
//             if (result.success) {
//                 setScenarios(result.result)
//             }
//         } catch (error) {
//             console.error('Error loading scenarios:', error)
//         }
//     }

//     const loadBills = async () => {
//         try {
//             const response = await fetch('/api/v1/bills/list', {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
//             const result = await response.json()
//             if (result.success) {
//                 setBills(result.result)
//             }
//         } catch (error) {
//             console.error('Error loading bills:', error)
//         }
//     }

//     const handleCreateScenario = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setLoading(true)

//         try {
//             const response = await fetch('/api/v1/scenarios/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({
//                     ...newScenario,
//                     newTariffRate: newScenario.newTariffRate ? parseFloat(newScenario.newTariffRate) : undefined,
//                     newSupplierRate: newScenario.newSupplierRate ? parseFloat(newScenario.newSupplierRate) : undefined,
//                     energyMixPercentage: newScenario.energyMixPercentage ? parseFloat(newScenario.energyMixPercentage) : undefined,
//                     consumptionReduction: newScenario.consumptionReduction ? parseFloat(newScenario.consumptionReduction) : undefined
//                 })
//             })

//             const result = await response.json()
//             if (result.success) {
//                 alert('Scenario created successfully!')
//                 setShowCreateModal(false)
//                 setNewScenario({
//                     billId: '',
//                     scenarioName: '',
//                     description: '',
//                     scenarioType: 'tariff_change',
//                     newTariffRate: '',
//                     newSupplierName: '',
//                     newSupplierRate: '',
//                     energyMixPercentage: '',
//                     consumptionReduction: ''
//                 })
//                 loadScenarios()
//             } else {
//                 alert('Error creating scenario: ' + result.message)
//             }
//         } catch (error) {
//             console.error('Error creating scenario:', error)
//             alert('Error creating scenario')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const getScenarioTypeLabel = (type: string) => {
//         switch (type) {
//             case 'tariff_change': return 'Tariff Change'
//             case 'supplier_change': return 'Supplier Change'
//             case 'energy_mix': return 'Energy Mix'
//             case 'consumption_optimization': return 'Consumption Optimization'
//             default: return type
//         }
//     }

//     return (
//         <div className="max-w-7xl mx-auto p-6">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold">Scenario Simulation</h1>
//                 <button
//                     onClick={() => setShowCreateModal(true)}
//                     className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
//                 >
//                     Create New Scenario
//                 </button>
//             </div>

//             {/* Scenarios List */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold mb-4">Your Scenarios</h2>

//                 {scenarios.length === 0 ? (
//                     <p className="text-gray-500">No scenarios created yet</p>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full table-auto">
//                             <thead>
//                                 <tr className="bg-gray-50">
//                                     <th className="px-4 py-2 text-left">Scenario Name</th>
//                                     <th className="px-4 py-2 text-left">Type</th>
//                                     <th className="px-4 py-2 text-left">Base Amount</th>
//                                     <th className="px-4 py-2 text-left">Projected Amount</th>
//                                     <th className="px-4 py-2 text-left">Savings</th>
//                                     <th className="px-4 py-2 text-left">Annual Savings</th>
//                                     <th className="px-4 py-2 text-left">Status</th>
//                                     <th className="px-4 py-2 text-left">Created</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {scenarios.map((scenario) => (
//                                     <tr key={scenario._id} className="border-b">
//                                         <td className="px-4 py-2 font-medium">{scenario.scenarioName}</td>
//                                         <td className="px-4 py-2">{getScenarioTypeLabel(scenario.scenarioType)}</td>
//                                         <td className="px-4 py-2">₹{scenario.baseTotalAmount.toLocaleString()}</td>
//                                         <td className="px-4 py-2">₹{scenario.projectedTotalAmount.toLocaleString()}</td>
//                                         <td className="px-4 py-2">
//                                             <span className={`font-medium ${scenario.costSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                                 ₹{scenario.costSavings.toLocaleString()} ({scenario.percentageSavings.toFixed(1)}%)
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-2 text-green-600 font-medium">
//                                             ₹{scenario.annualSavings.toLocaleString()}
//                                         </td>
//                                         <td className="px-4 py-2">
//                                             <span className={`px-2 py-1 rounded text-sm ${scenario.simulationStatus === 'completed' ? 'bg-green-100 text-green-800' :
//                                                     scenario.simulationStatus === 'approved' ? 'bg-blue-100 text-blue-800' :
//                                                         'bg-yellow-100 text-yellow-800'
//                                                 }`}>
//                                                 {scenario.simulationStatus}
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-2">{new Date(scenario.createdDate).toLocaleDateString()}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Create Scenario Modal */}
//             {showCreateModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-semibold">Create New Scenario</h3>
//                             <button
//                                 onClick={() => setShowCreateModal(false)}
//                                 className="text-gray-500 hover:text-gray-700"
//                             >
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>

//                         <form onSubmit={handleCreateScenario}>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {/* Base Bill Selection */}
//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Select Base Bill</label>
//                                     <select
//                                         value={newScenario.billId}
//                                         onChange={(e) => setNewScenario({ ...newScenario, billId: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         required
//                                     >
//                                         <option value="">Select a bill</option>
//                                         {bills.map((bill) => (
//                                             <option key={bill._id} value={bill._id}>
//                                                 {bill.billNumber} - {bill.consumerNumber} ({bill.billingMonth} {bill.billingYear}) - ₹{bill.totalAmount}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 {/* Scenario Details */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
//                                     <input
//                                         type="text"
//                                         value={newScenario.scenarioName}
//                                         onChange={(e) => setNewScenario({ ...newScenario, scenarioName: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Type</label>
//                                     <select
//                                         value={newScenario.scenarioType}
//                                         onChange={(e) => setNewScenario({ ...newScenario, scenarioType: e.target.value as any })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                     >
//                                         <option value="tariff_change">Tariff Change</option>
//                                         <option value="supplier_change">Supplier Change</option>
//                                         <option value="energy_mix">Energy Mix</option>
//                                         <option value="consumption_optimization">Consumption Optimization</option>
//                                     </select>
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                                     <textarea
//                                         value={newScenario.description}
//                                         onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         rows={3}
//                                     />
//                                 </div>


//                                 {newScenario.scenarioType === 'tariff_change' && (
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">New Tariff Rate (₹/kWh)</label>
//                                         <input
//                                             type="number"
//                                             step="0.01"
//                                             value={newScenario.newTariffRate}
//                                             onChange={(e) => setNewScenario({ ...newScenario, newTariffRate: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         />
//                                     </div>
//                                 )}

//                                 {newScenario.scenarioType === 'supplier_change' && (
//                                     <>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">New Supplier Name</label>
//                                             <input
//                                                 type="text"
//                                                 value={newScenario.newSupplierName}
//                                                 onChange={(e) => setNewScenario({ ...newScenario, newSupplierName: e.target.value })}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">New Supplier Rate (₹/kWh)</label>
//                                             <input
//                                                 type="number"
//                                                 step="0.01"
//                                                 value={newScenario.newSupplierRate}
//                                                 onChange={(e) => setNewScenario({ ...newScenario, newSupplierRate: e.target.value })}
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                             />
//                                         </div>
//                                     </>
//                                 )}

//                                 {newScenario.scenarioType === 'energy_mix' && (
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Renewable Energy Percentage (%)</label>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="100"
//                                             value={newScenario.energyMixPercentage}
//                                             onChange={(e) => setNewScenario({ ...newScenario, energyMixPercentage: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         />
//                                     </div>
//                                 )}

//                                 {newScenario.scenarioType === 'consumption_optimization' && (
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">Consumption Reduction (%)</label>
//                                         <input
//                                             type="number"
//                                             min="0"
//                                             max="100"
//                                             value={newScenario.consumptionReduction}
//                                             onChange={(e) => setNewScenario({ ...newScenario, consumptionReduction: e.target.value })}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                                         />
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex justify-end space-x-4 mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowCreateModal(false)}
//                                     className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
//                                 >
//                                     {loading ? 'Creating...' : 'Create Scenario'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ScenarioPage




const ScenarioPage = () => {
    return (
        <div>ScenarioPage</div>
    )
}

export default ScenarioPage