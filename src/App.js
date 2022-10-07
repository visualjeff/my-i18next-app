import logo from './logo.svg';
import './App.css';

import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Fetch from 'i18next-fetch-contentstack';

const STACK_API_KEY='<STACK_API_KEY_HERE>';
const ACCESS_TOKEN='<ACCESS_TOKEN_HERE>';
const TARGET_ENVIRONMENT='development';

const options = {
    loadPath: `https://azure-na-graphql.contentstack.com/stacks/${STACK_API_KEY}?environment={{ns}}&query=query($locale:String!){all_localizedtext(locale:$locale){items { title text } }}&variables={"locale":"{{lng}}"}`,
    
    parse: function(data) {
        const { data: { all_localizedtext: { items }}} = data;
        let translations = items.reduce((accumulator, value) => {                                                                                                                                                  
            const { ['title']: remove, ...rest } = value;
            rest.text = rest.text.value.reduce((inner_accumulator, inner_value) => {
                const { ['key']: inner_remove, ...inner_rest } = inner_value;
                inner_accumulator[inner_remove.replaceAll(" ","_")] = inner_rest.value;
                return inner_accumulator;
            }, {});
            accumulator[remove.replaceAll(" ","_")] = rest.text;
            return accumulator;
        }, {});
        translations = Object.keys(translations).reduce((accumulator, value) => {
            accumulator = { ...accumulator, ...translations[value]}
            return accumulator;
        }, {});

        return translations;
    },
    
    fetch: async function (url, options, callback) {
        const response = await fetch(url, {
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'access_token': ACCESS_TOKEN,
            }
        });
        return response;
    },
}


i18n
  .use(Fetch)
  .use(initReactI18next)
  .init({
    lng: 'en-US',
    fallbackLng: false,
    lowerCaseLng: true,
    load: 'currentOnly',
    ns: TARGET_ENVIRONMENT,
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: options  
  });



function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <p>
          {t('SystemDown')}
        </p>

      </header>
    </div>
  );
}

export default App;
