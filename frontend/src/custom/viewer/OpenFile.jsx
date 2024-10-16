import { useEffect } from 'react';

const OpenFile = ({ file }) => {
  const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

  useEffect(() => {
    window.open(fileUrl, '_blank');
  }, [fileUrl]);

  return null;
};

export default OpenFile;