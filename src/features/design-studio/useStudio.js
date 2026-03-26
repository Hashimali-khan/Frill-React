import { useSelector } from 'react-redux';

export function useStudio() { const studio = useSelector(s => s.studio); return { studio }; }
