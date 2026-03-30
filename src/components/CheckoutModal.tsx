import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'react-qr-code';
import { X, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  paymentMethod: 'Cash' | 'UPI';
  onComplete: () => void;
}

export function CheckoutModal({ isOpen, onClose, total, paymentMethod, onComplete }: CheckoutModalProps) {
  if (!isOpen) return null;

  const upiString = `upi://pay?pa=YOUR_UPI_ID@okaxis&pn=CoffeeShop&am=${total.toFixed(2)}&cu=INR`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h2>
            <p className="text-gray-500">Total Amount: <span className="font-bold text-coffee-dark text-xl">₹{total.toFixed(2)}</span></p>
          </div>

          {paymentMethod === 'UPI' ? (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 mb-8">
              <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                <QRCode value={upiString} size={200} />
              </div>
              <p className="text-sm text-gray-500 font-medium text-center">Scan with any UPI app to pay</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 mb-8">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <p className="text-lg font-bold text-gray-900 text-center">Ready for {paymentMethod} payment</p>
              <p className="text-sm text-gray-500 text-center mt-2">Please collect the amount from the customer.</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="w-full py-4 bg-coffee-dark text-white rounded-2xl font-bold text-lg shadow-xl shadow-coffee-dark/20 hover:bg-[#6b7280] transition-colors"
          >
            Confirm Payment & Print
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
