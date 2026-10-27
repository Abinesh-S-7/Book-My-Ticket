import { useState } from 'react';
import './BookingModal.css';

export default function BookingModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    basePrice, 
    unitName = "Seats", 
    maxAvailable 
}) {
    const [units, setUnits] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const totalAmount = basePrice * units;

    async function handleSubmit() {
        setIsProcessing(true);
        
        try {
            await onConfirm({
                units: parseInt(units),
                paymentMethod: paymentMethod
            });
        } finally {
            setIsProcessing(false); 
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Complete Your Booking</h3>
                
                <div className="modal-form-group">
                    <label>Number of {unitName}</label>
                    <input 
                        type="number" 
                        min="1" 
                        max={maxAvailable} 
                        value={units} 
                        onChange={(e) => setUnits(e.target.value)} 
                        disabled={isProcessing} 
                    />
                    <small style={{color: '#666'}}>Max available: {maxAvailable}</small>
                </div>

                <div className="modal-form-group">
                    <label>Payment Method</label>
                    <select 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={isProcessing} 
                    >
                        <option value="UPI">UPI</option>
                        <option value="CREDIT_CARD">Credit Card</option>
                        <option value="DEBIT_CARD">Debit Card</option>
                        <option value="NET_BANKING">Net Banking</option>
                    </select>
                </div>

                <div className="price-calculation">
                    <span style={{color: '#555', fontSize: '14px'}}>Total Amount Payable</span>
                    <p className="total-price">₹{totalAmount}</p>
                </div>

                <div className="modal-actions">
                    <button 
                        className="btn-cancel-modal" 
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn-confirm-pay" 
                        onClick={handleSubmit}
                        disabled={isProcessing} 
                        style={{ opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'wait' : 'pointer' }}
                    >
                        {isProcessing ? "Processing..." : "Confirm & Pay"}
                    </button>
                </div>
            </div>
        </div>
    );
}