import { createSlice } from '@reduxjs/toolkit';
import { getInitialLanguage, setLanguageDirection } from '../../utils/rtl';

const initialLang = getInitialLanguage();
setLanguageDirection(initialLang);

const initialState = {
  current: initialLang,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.current = action.payload;
      setLanguageDirection(action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
