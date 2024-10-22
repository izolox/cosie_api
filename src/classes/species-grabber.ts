import axios from 'axios'
import * as cheerio from 'cheerio';
import { SpeciesData, SpeciesStability, SpeciesValue } from './types';
import { CacheMethod } from '../decorators/cache-method';

const SPECIES_URL = 'https://creatures-of-sonaria-official.fandom.com/wiki/Official_Creatures'
const VALUE_URL = 'https://www.game.guide/'

function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

const convertToSlug = {
  "value": function (text: string): string { // name-name2
    return removeAccents(text).toLowerCase().replace(/ /g, '-')
  },
  "wiki": function (text: string): string { // Name_Name2
    return text.replace(/ /g, '_')
  }
}

function convertValue(value: string): SpeciesValue {
  const values = value.split('-')
  const multipliers: Record<string, number> = {
    'k': 1000,
    'm': 1000000,
    'b': 1000000000
  }

  const min = values[0].trim()
  const max = values[1] ? values[1].trim() : min

  const minMultiplier = min.slice(-1) in multipliers ? multipliers[min.slice(-1)] : 1
  const maxMultiplier = max.slice(-1) in multipliers ? multipliers[max.slice(-1)] : 1

  return {
    min: parseFloat(min) * minMultiplier,
    max: parseFloat(max) * maxMultiplier
  }
}

class SpeciesGrabber {
  defaultData: SpeciesData

  constructor() {
    this.defaultData = {
      name: 'Unknown',
      value_min: 0,
      value_max: 0,
      demand: 0,
      stability: SpeciesStability.UNKNOWN
    }
  }

  private async scrapeValueData(name: string, url: string): Promise<SpeciesData> {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const value = $('.e-con-inner p').filter((_, element) => {
          return $(element).text().startsWith('Value:')
        }).text().split(':')[1].trim()

        const demand = $('.e-con-inner p').filter((_, element) => {
          return $(element).text().startsWith('Demand:')
        }).text().split(':')[1].trim()

        const stability = $('.e-con-inner p').filter((_, element) => {
          return $(element).text().startsWith('Stability:')
        }).text().split(':')[1].trim()

        console.log('Success:', url);

        const parsedValues = convertValue(value)
        const parsedDemand = parseInt(demand.split('/')[0])
        const parsedStability = stability in SpeciesStability 
          ? SpeciesStability[stability as keyof typeof SpeciesStability] 
          : SpeciesStability.UNKNOWN;

        return {
          name: name,
          value_min: parsedValues.min,
          value_max: parsedValues.max,
          demand: parsedDemand,
          stability: parsedStability
        }
    } catch (error: any) {
        if (error?.response && error.response.status === 404) {
          console.error('Failure: (404)', url);
        } else {
          console.error('Error:', url, error);
        }
        return this.defaultData
    }
  }

  @CacheMethod(30000)

  async fetchSpecies(name: string): Promise<SpeciesData> {
    const slug = convertToSlug.value(name)
    const url = `${VALUE_URL}${slug}-value-creatures-of-sonaria`

    return this.scrapeValueData(name, url)
  }
}

export default SpeciesGrabber