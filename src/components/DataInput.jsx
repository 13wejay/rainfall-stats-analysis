import React, { useState } from 'react';
import { Plus, Trash2, Upload, Database } from 'lucide-react';
import { SAMPLE_DATASETS, DATA_TEMPLATES } from '../data/sampleData';

export default function DataInput({ onDataChange }) {
  const [dataType, setDataType] = useState('daily');
  const [inputMethod, setInputMethod] = useState('manual');
  const [data, setData] = useState([{ id: 1, date: '', value: '' }]);
  const [pasteText, setPasteText] = useState('');

  const handleDataTypeChange = (type) => {
    setDataType(type);
    setData([{ id: 1, date: '', value: '' }]);
    onDataChange({ type, data: [], isValid: false });
  };

  const handleAddRow = () => {
    const newId = Math.max(0, ...data.map(d => d.id)) + 1;
    setData([...data, { id: newId, date: '', value: '' }]);
  };

  const handleRemoveRow = (id) => {
    if (data.length > 1) {
      const newData = data.filter(d => d.id !== id);
      setData(newData);
      validateAndEmit(newData);
    }
  };

  const handleCellChange = (id, field, value) => {
    const newData = data.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    );
    setData(newData);
    validateAndEmit(newData);
  };

  const validateAndEmit = (currentData) => {
    const validData = currentData.filter(d => 
      d.date && d.date.trim() !== '' && 
      d.value && !isNaN(parseFloat(d.value)) && parseFloat(d.value) > 0
    );
    
    const isValid = validData.length >= 10; // Minimum 10 data points
    
    onDataChange({
      type: dataType,
      data: validData.map(d => ({
        date: d.date,
        value: parseFloat(d.value)
      })),
      isValid
    });
  };

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    
    const lines = pasteText.trim().split('\n');
    const parsedData = [];
    let id = 1;
    
    lines.forEach(line => {
      // Try tab-separated first, then comma-separated
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      
      if (parts.length >= 2) {
        const date = parts[0].trim();
        const value = parts[1].trim();
        
        if (date && !isNaN(parseFloat(value))) {
          parsedData.push({ id: id++, date, value });
        }
      }
    });
    
    if (parsedData.length > 0) {
      setData(parsedData);
      setInputMethod('manual');
      validateAndEmit(parsedData);
      setPasteText('');
    }
  };

  const handleLoadSample = (sampleKey) => {
    const sample = SAMPLE_DATASETS[sampleKey];
    setDataType(sample.type);
    setData(sample.data);
    setInputMethod('manual');
    validateAndEmit(sample.data);
  };

  return (
    <div className="space-y-6">
      {/* Data Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Type
        </label>
        <div className="flex gap-2">
          {['daily', 'monthly', 'annual'].map(type => (
            <button
              key={type}
              onClick={() => handleDataTypeChange(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dataType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {dataType === 'daily' && 'Daily maximum annual rainfall (one value per year)'}
          {dataType === 'monthly' && 'Monthly total or maximum rainfall'}
          {dataType === 'annual' && 'Annual total rainfall'}
        </p>
      </div>

      {/* Input Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Method
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setInputMethod('manual')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              inputMethod === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Plus size={16} />
            Manual Entry
          </button>
          <button
            onClick={() => setInputMethod('paste')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              inputMethod === 'paste'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Upload size={16} />
            Paste Data
          </button>
          <button
            onClick={() => setInputMethod('sample')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              inputMethod === 'sample'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Database size={16} />
            Sample Data
          </button>
        </div>
      </div>

      {/* Manual Entry */}
      {inputMethod === 'manual' && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Enter Rainfall Data</h3>
            <button
              onClick={handleAddRow}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 text-sm"
            >
              <Plus size={16} />
              Add Row
            </button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No.</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      {dataType === 'daily' ? 'Year' : dataType === 'monthly' ? 'Month/Year' : 'Year'}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Rainfall (mm)
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={row.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={row.date}
                          onChange={(e) => handleCellChange(row.id, 'date', e.target.value)}
                          placeholder={dataType === 'monthly' ? 'Jan 2024' : '2024'}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.1"
                          value={row.value}
                          onChange={(e) => handleCellChange(row.id, 'value', e.target.value)}
                          placeholder="0.0"
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleRemoveRow(row.id)}
                          disabled={data.length === 1}
                          className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <p className="mt-2 text-sm text-gray-600">
            Minimum 10 data points required. Current: {data.filter(d => d.date && d.value && parseFloat(d.value) > 0).length}
          </p>
        </div>
      )}

      {/* Paste Data */}
      {inputMethod === 'paste' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Paste Your Data</h3>
          <p className="text-sm text-gray-600 mb-2">
            Paste tab-separated or comma-separated data. Format: Date, Rainfall (mm)
          </p>
          <p className="text-sm text-gray-600 mb-3">
            Example: 2024{'\t'}145.5 or 2024,145.5
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="2024	145.5&#10;2023	132.8&#10;2022	168.2"
            className="w-full h-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <button
            onClick={handlePaste}
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Parse and Load Data
          </button>
        </div>
      )}

      {/* Sample Data */}
      {inputMethod === 'sample' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Sample Dataset</h3>
          <div className="space-y-3">
            {Object.entries(SAMPLE_DATASETS).map(([key, sample]) => (
              <div
                key={key}
                className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => handleLoadSample(key)}
              >
                <h4 className="font-medium text-gray-800">{sample.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{sample.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {sample.data.length} data points
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
