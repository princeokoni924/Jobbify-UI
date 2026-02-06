 // eslint-disable-next-line no-unused-vars
 const getColorClasses = (color, isPrimary = false) => {
    const colors = {
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        badge: 'bg-gray-100 text-gray-700',
        button: 'bg-gray-900 hover:bg-gray-800 text-white',
        icon: 'text-gray-600'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-300',
        badge: 'bg-indigo-100 text-indigo-700',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        icon: 'text-indigo-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-300',
        badge: 'bg-purple-100 text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        icon: 'text-purple-600'
      }
    };
    return colors[color];
  };
  export default getColorClasses