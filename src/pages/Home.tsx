import CoffeeList from '../components/CoffeeList/CoffeeList'
import AdOne from '../components/AdOne/AdOne'
import AdTwo from '../components/AdTwo/AdTwo'

export default function Home() {
  return (
    <div>
       <AdOne />
      <CoffeeList />
       <AdTwo />
    </div>
  )
}