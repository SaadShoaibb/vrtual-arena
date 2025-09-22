'use client';

import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setLanguage } from '@/Store/ReduxSlice/languageSlice';
import { validateLocale } from '../utils/languageUtils';

export default function LocaleUpdater() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const locale = validateLocale(searchParams.get('locale'));
    dispatch(setLanguage(locale));
  }, [searchParams, dispatch]);
  
  return null;
}
