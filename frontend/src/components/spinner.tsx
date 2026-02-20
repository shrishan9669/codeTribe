// Spinner component for loading states
 const Spinner = ({borderColor}:any) => (
  <div className={`w-6 h-6 border-2 ${borderColor ? 'border-blue-900':'border-white'}   border-t-transparent rounded-full animate-spin mx-auto`}></div>
);

export default Spinner