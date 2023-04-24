"use client"

import { Country, City } from "country-state-city";
import Select from 'react-select'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlobeIcon } from "@heroicons/react/solid";


type countryOption = {
    value: {
        latitude: string;
        longitude: string;
        isoCode: string;
    };
    label: string;
} | null;

type cityOption = {
    value: {
        latitude: string;
        longitude: string;
        countryCode: string;
        name: string;
        stateCode: string;
    };
    label: string;
} | null;


type option = {
    value: {
        latitude: string;
        longitude: string;
        isoCode: string;
    };
    label: string;
} | null;

const options = Country.getAllCountries().map((country) => ({
    value: {
        latitude: country.latitude,
        longitude: country.longitude,
        isoCode: country.isoCode,
    },
    label: country.name,
}))

function CityPicker() {

    //use a state to track user's input
    //const [state] = useState()
    //<option>中的option be the type that I actually went ahead and defined in type, value and label.
    const [selectedCountry, setSelectedCountry] = useState<countryOption>(null);
    const [selectedCity, setSelectedCity] = useState<cityOption>(null);
    //a router: 選擇好後，take that info and redirect you to the page (url like: /xxx/xx)
    //the page is cachable
    const router = useRouter();

    const handelSelectedCountry = (option: countryOption) => {
        setSelectedCountry(option);
        setSelectedCity(null);
        //前一行的null，是指如果重選國家，就要reset city section
    }

    const handelSelectedCity = (option: cityOption) => {
        setSelectedCity(option);
        router.push(`/location/${option?.value.name}/${option?.value.latitude}/${option?.value.longitude}`)
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white">
                    <GlobeIcon className="h-5 w-5 text-white" />
                    <label htmlFor="country">Country</label>
                </div>

                <Select
                    className="text-black"
                    //map the value
                    value={selectedCountry}
                    onChange={handelSelectedCountry}
                    options={options} />
            </div>

            


            {selectedCountry && (
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-white">
                        <GlobeIcon className="h-5 w-5 text-white" />
                        <label htmlFor="country">City</label>
                    </div>

                    <Select
                        className="text-black"
                        //map the value
                        value={selectedCity}
                        onChange={handelSelectedCity}
                        options={
                            City.getCitiesOfCountry(selectedCountry.value.isoCode)?.map(state => ({
                                value:{
                                    latitude: state.latitude!,
                                    longitude: state.longitude!,
                                    countryCode: state.countryCode,
                                    name: state.name,
                                    stateCode: state.stateCode,
                                },
                                label: state.name,                                
                            }))
                        } />
                </div>
            )}

        </div>
    )
}

export default CityPicker
