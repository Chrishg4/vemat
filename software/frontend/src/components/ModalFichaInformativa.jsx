import React from 'react';

const ModalFichaInformativa = ({ mosquito, onClose }) => {
  if (!mosquito) return null;

  const InfoItem = ({ label, children }) => (
    <div className="mb-4">
      <h4 className="font-bold text-green-500 text-md">{label}</h4>
      <p className="text-gray-700 dark:text-gray-300 text-sm">{children}</p>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative transform transition-all duration-300 ease-in-out scale-95 hover:scale-100"
        onClick={e => e.stopPropagation()} // Evita que el clic en el modal lo cierre
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold"
        >
          &times;
        </button>
        
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{mosquito.species}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className='pr-4'>
                <img src={mosquito.imageUrl} alt={mosquito.species} className="w-full h-auto rounded-lg shadow-lg object-cover mb-4" />
                <InfoItem label="Fecha de Captura">{mosquito.captureDate}</InfoItem>
                <InfoItem label="Ciclo de Vida">{mosquito.lifeCycle}</InfoItem>
                <InfoItem label="Temporada Común">{mosquito.commonSeason}</InfoItem>
            </div>
            <div>
                <InfoItem label="Provincias donde se encuentra">
                    {mosquito.provinces.join(', ')}
                </InfoItem>
                <InfoItem label="Métodos de Control">
                    <ul className="list-disc list-inside">
                        {mosquito.controlMethods.map((method, index) => (
                            <li key={index}>{method}</li>
                        ))}
                    </ul>
                </InfoItem>
                <InfoItem label="Enfermedades que Transmite">
                    {mosquito.diseases.map((disease, index) => (
                        <div key={index} className="mb-2">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{disease.name}</p>
                            <p className="text-gray-600 dark:text-gray-300 text-xs">Costo de Tratamiento: {disease.treatmentCost}</p>
                        </div>
                    ))}
                </InfoItem>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ModalFichaInformativa;