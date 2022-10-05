import logo from './logo.svg';
import './App.css';

import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Fetch from 'i18next-fetch-contentstack';

const options = {
    loadPath: `https://azure-na-graphql.contentstack.com/stacks/bltc70318e3756fe4ef?environment={{ns}}&query=query($locale:String!){all_localizedtext(locale:$locale){items { title text } }}&variables={"locale":"{{lng}}"}`,
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
    stringify: function() {
        return JSON.stringify
    },
    allowMultiLoading: false, // set loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}' to adapt to multiLoading
    multiSeparator: '+',
    fetch: async function (url, options, callback) {
        const response = await fetch(url, {
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'access_token': 'cs3ffa737b260d4abd4cd07ece',
            }
        });
        return response;
    },
}


i18n
  .use(Fetch) // passes i18n down to react-i18next
  .use(initReactI18next)
  .init({
    lng: 'en-US',
    fallbackLng: false,
    lowerCaseLng: true,
    load: 'currentOnly',
    ns: 'development',
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
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
