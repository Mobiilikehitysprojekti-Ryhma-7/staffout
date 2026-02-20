# Mobiilikehitysprojekti Ryhma7 - Staffout

Lyhyt kuvaus: **Staffout on sovellus, jossa yrityksen työntekijät voivat tarkastella henkilöstöetuja ja vapaa-ajan tapahtumia sekä keskustella avoimesti. Sovellus luotiin työyksinäisyyden vähentämiseen ja työyhteisöjen yhdentämiseen**.

Rakennettu **React Native + TypeScript + Expo** -stackilla. Tuettuina **Android**, **iOS** sekä **Web** (lähes kaikki ominaisuudet).

## Sisällys
- [Tärkeimmät ominaisuudet](#tärkeimmät-ominaisuudet)
- [Teknologiat](#teknologiat)
- [Projektirakenne](#projektirakenne)
- [Vaatimukset](#vaatimukset)
- [Asennus](#asennus)
- [Käynnistys](#käynnistys)
- [Tekijät](#tekijät)

## Tärkeimmät ominaisuudet
- ✅ Firebase-autentikointi
- ✅ Cloud firestore
- ✅ Laitteen kuvagallerian käyttö
- ✅ Laitteen sijainnin käyttö
- ✅ Paikalliset notifikaatiot

## Teknologiat
- **React Native** (Expo)
- **TypeScript**
- **Expo Router**
- **UI**: React Native / custom
- **Kehitys/testaus:**: Expo Go / Expo dev client

## Projektirakenne

Alla projektin keskeinen rakenne:

```txt
src
├─ app/                               # Expo Router -reitit ja näkymät (route groups)
│  ├─ (admin)/                        # Admin-näkymät ja -reitit
│  ├─ (chat)/                         # Keskustelu / chat -reitit
│  ├─ (organization)/                 # Organisaatioon liittyvät näkymät
│  ├─ (settings)/                     # Asetukset / profiili
│  ├─ (tabs)/                         # Tab-navigaation reitit (päänäkymät)
│  ├─ _layout.tsx                     # Routerin layout + navigaatiokuori
│  ├─ auth.tsx                        # Kirjautumis-/autentikointinäkymä (tai auth-flow)
│  └─ ...
│
├─ components/                        # Uudelleenkäytettävät UI-komponentit
│  ├─ benefits/                       # Etuihin liittyvät komponentit
│  ├─ channels/                       # Kanavat / ryhmät -komponentit
│  ├─ charts/                         # Kaaviot ja visualisoinnit
│  ├─ events/                         # Tapahtumat -komponentit
│  ├─ messages/                       # Viestit / chat-UI komponentit
│  ├─ navigation/                     # Navigaation UI (headerit, tabbar, linkit)
│  ├─ signout/                        # Uloskirjautumiseen liittyvät komponentit
│  ├─ ui/                             # Yleiset UI-peruspalikat (Button, Card, Modal...)
│  ├─ AuthForm.tsx                    # Kirjautumislomakkeen komponentti
│  ├─ ImagePicker.tsx                 # Kuvan valinta galleriasta komponentti
│  └─ ...
│
├─ config/                            # Sovelluksen konfiguraatiot ja integraatioasetukset
│  ├─ firebaseConfig.ts               # Firebase-initialisointi / asetukset
│  └─ supabaseConfig.ts               # Supabase-initialisointi / asetukset
│
├─ constants/                         # Vakioarvot (värit ja kaupunkiarvot)
│  └─ ...
│
├─ hooks/                             # Custom hookit (UI + data + auth -logiikan yhdistäminen)
│  ├─ useAuth.ts                      # Autentikointitila ja -toiminnot
│  ├─ useBenefits.ts                  # Etuihin liittyvä data
│  ├─ useChannels.ts                  # Kanavat/ryhmät -data
│  ├─ useMessages.ts                  # Viestit/chat -data
│  ├─ useLocation.ts                  # Sijainti -data
│  └─ ...                             # Muut hookit
│
├─ services/                          # Data-/integraatiokerros (API/Firebase/Storage)
│  ├─ auth/                           # Authiin liittyvät palvelut ja apurit
│  ├─ chat/                           # Chat/viestintä -palvelut (Firestore)
│  ├─ storage/                        # Kuva tiedostojen tallennus (Supabase)
│  ├─ benefits.service.ts             # Etujen dataoperaatiot (Firestore)
│  ├─ events.service.ts               # Tapahtumien dataoperaatiot (Firestore)
│  ├─ members.service.ts              # Jäsenet / käyttäjälistat / roolit
│  ├─ organizations.service.ts        # Organisaatioiden dataoperaatiot
│  └─ users.service.ts                # Käyttäjäprofiilit / käyttäjädata
│
├─ types/                             # Tyypit
│  └─ ...                             # Kaupunki, sijainti, edut
│
├─ utils/                             # Apufunktiot (formatointi, validointi, helperit)
│  └─ ...                             # Päivämäärä/teksti + kaupunkikaavion helperit
│
├─ app.json                           # Expo-konfiguraatio
└─ README.md
```

## Vaatimukset
- Node.js (LTS)
- npm / yarn
- Expo Go (mobiilissa) tai emulaattori (Android Studio / Xcode)


## Asennus
```bash
git clone [repo-url]
cd [repo-kansio]
npm install
```

## Käynnistys
```bash
npx expo start
```

## Tekijät
- **Santeri Mikkola** – [@SanteriMikkola](https://github.com/SanteriMikkola)
- **Eemil Koskelo** – [@eemildev](https://github.com/eemildev)
- **Kaisa Kangas** – [@Kaikanga](https://github.com/Kaikanga)
