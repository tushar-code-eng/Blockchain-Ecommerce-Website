import { ethers } from 'ethers'

// Components
import Rating from './Rating'

const Section = ({ Title, items, togglePop }) => {
    return (
        <div className='cards__section'>
            <h3 className="title">{Title}</h3>

            <hr />

            <div className="container">
                <div className="row my-3">
                    {
                        items.map((item, index) =>
                            <div className="col-md-4 my-3"  key={index} >
                                <div className="card"onClick={() => togglePop(item)}>
                                    <img style={{height:"25vw"}} src={item.image} className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h4>{item.title}</h4>
                                        <Rating value={item.rating} />
                                        <p>${ethers.utils.formatUnits(item.cost.toString(), 'ether')}</p>
                                    </div>
                                </div>
                            </div>

                        )

                    }
                </div>
            </div>
        </div>
    );
}

export default Section;