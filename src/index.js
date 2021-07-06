import React from "react";
import useState from 'react-usestateref'
import {useEffect} from 'react';
import _ from 'lodash';
import moment from 'moment'

const Table = (props) => {

    const [data, setData, dataRef] = useState([]);
    const [filteredData, setFilteredData, filteredDataRef] = useState([])
    const [asc, setAsc, dataAsc] = useState(true);
    const [lastHeaderClicked, setLastHeaderClicked, lastHeaderClickedRef] = useState(null);
    const [paginationNumber, setPaginationNumber, paginationNumberRef] = useState(props.paginationNumber);
    const [pagination, setPagination, paginationRef] = useState([]);
    const [page, setPage, pageRef] = useState(0);

    useEffect(() => {
        setData(props.data)
        setFilteredData(props.data);
        filter()
        orderBy(lastHeaderClicked);
        splitArrayToPagination();
    }, [props.data, props.paginationNumber]);
        
    const renderTable = () => {
        if (paginationRef.current.length > 0) {
            return paginationRef.current[pageRef.current].map((row, key) => {
                return (
                    <tr className='border border-gray-200 hover:bg-gray-100 text-center'>
                        {
                            renderTdTable(row)
                        }
                    </tr>        
                )    
            })
        }
    }

    const renderHeaders = () => {
        return props.headers.map((header, key) => {
            return [
                <th className="py-3 px-6 text-center">
                    <div className="hover:cursor-pointer"><img onClick={() => orderBy(header)} src="resources/sort.svg"  height="16" width="16"/><span className="ml-1  text-sm hover:cursor-pointer">{header.header}</span></div>
                    <div className="flex justify-center">
                    {header.type == 'string' &&
                        renderFilter(key)      
                    }
                    </div>
                </th>   
            ]
        })
    }

    const renderTdTable = (row) => {
        return (
            props.headers.map(header => {       
                if(header.type == 'icon')
                    return (<td className="py-3 px-6 text-left whitespace-nowrap"><img src="resources/eye.svg"  height="36" width="36" className="w-88 rounded"/></td>)
                else if(header.type == 'string')
                    return (<td className="py-3 px-6 text-center">{row[header.accessor]}</td>)  
                else if(header.type == 'date')
                    return (<td className="py-3 px-6 text-center">{row[header.accessor]}</td>)                      
            })
        )
    }

    const filter = () => {
        let blankValues = true;
        let tmpData = dataRef.current;
        for (let index = 0; index < props.headers.length; index++) {
            if (props.headers[index].type != "icon"){
                if (document.getElementById(index+'filter') != null) {
                    let value = document.getElementById(index+'filter').value;
                    if(value !='' && value != null){            
                        tmpData = tmpData.filter(row => row[props.headers[index].accessor].includes(value));
                        blankValues = false;
                    }   
                }          
            }
        }
        if (blankValues)
            setFilteredData(dataRef.current);
        else
            setFilteredData(tmpData);

        setPage(0)
        splitArrayToPagination();
    }

    const orderBy = (header) => {

        if (header != null) {
            
            if (header.type == 'string') {
        
                let ordered;
                
                if (asc) 
                    ordered = _.orderBy(dataRef.current, [header.accessor], [('asc')]);
                else
                    ordered = _.orderBy(dataRef.current, [header.accessor], [('desc')]);
            
                setData(ordered);               
                setAsc(!asc);
                setLastHeaderClicked(header);

            }else if (header.type == 'date' || header.type == 'datetime'){
                let ordered;
                if (asc) {
                    ordered = dataRef.current.sort((a, b) =>  {
                        let dateA = moment(a[header.accessor], header.format).format('YYYY-MM-DD hh:mm:ss');
                        let dateB = moment(b[header.accessor], header.format).format('YYYY-MM-DD hh:mm:ss');;
                        if(Date.parse(dateB) > Date.parse(dateA))
                            return 1;
                        else
                            return -1;
                    });
                }else{
                    ordered = dataRef.current.sort((a, b) =>  {
                        let dateA = moment(a[header.accessor], header.format).format('YYYY-MM-DD hh:mm:ss');
                        let dateB = moment(b[header.accessor], header.format).format('YYYY-MM-DD hh:mm:ss');;
                        if(Date.parse(dateB) > Date.parse(dateA))
                            return 1;
                        else
                            return -1;
                    }).reverse();
                }
                setData(ordered);
                setAsc(!asc);
            }
        }
        filter();
        setPage(0);  
        splitArrayToPagination();
    }


    const splitArrayToPagination = () => {
        let tmpArray = [];
        let i = 0;
        setPagination([]);
        filteredDataRef.current.map((row, key)=> {
            if (i === paginationNumberRef.current) {
                setPagination([...paginationRef.current, tmpArray]);
                tmpArray = [];
                i = 0;
            }
            if(key + 1 == filteredDataRef.current.length){
                setPagination([...paginationRef.current, tmpArray]);
            }
            tmpArray.push(row);
            i++;
        }); 
    }

    const renderPaginationOptions = () => {
        return [5,10,15,50].map((opt) => {
            if (opt == Number(paginationNumberRef.current)) {
                return <option value={opt} default selected>{opt} rows</option>
            }else{
                return <option value={opt}>{opt} rows</option>
            }
        });
    }

    const renderPaginationButtons = () => {
        return (
            <div>
            <span>Page <input className="border border-gray-300 p-2 my-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200 w-1/6 text-center"  value={Number(pageRef.current) +1} onChange={(event)=>{
               if (!isNaN(event.target.value) && event.target.value <= paginationRef.current.length && event.target.value >= 1) {
                   setPage(Number(event.target.value) - 1);
               }
            }}/> of {paginationRef.current.length } </span>
        </div> 
        )
    }

    const renderFilter = (key) => {
        return (
            <div class="relative text-gray-600">
                <input id={key + "filter"} onChange={(e) => filter()} type="search" name="serch" placeholder="Search" class="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"/>
                <button type="submit" class="absolute right-0 top-0 mt-3 mr-4">
                    <img src="resources/search.svg" class="h-4 w-4 fill-current"></img>
                </button>
            </div>
        )
    }

    const renderPaginationNumber = () => {
        return (
            <select className="border border-gray-300 p-2 my-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200 w-1/3 text-center" onChange={(event) => {
                setPage(0)
                setPaginationNumber(Number(event.target.value));
                splitArrayToPagination();
            }}>
                {renderPaginationOptions()}
            </select>
        )
    }

    const renderLeftArrow = () => {

        return (
                
            <div className="hover:cursor-pointer items-center justify-start h-full pl-5 flex">
                <img src="/left.svg" width="32" height="32" onClick={() => {
                    if (page != 0) {
                        setPage((page-1))
                    }   
                }}/>
            </div>   
        )

    }

    const renderRightArrow = ()  => {
        return (
            <div className="hover:cursor-pointer items-center justify-end h-full pr-5 flex " >
                <img src="./resources/right.svg" width="32" height="32" onClick={() => {
                    if (page + 1 < paginationRef.current.length) {
                        setPage((page+1))
                    }       
                }}/>
            </div>
        )
    }

    return(
        <div className="overflow-x-auto min-w-screen min-h-screen bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
            <div className="min-w-screen w-screen">
                {
                    filteredDataRef.current.length > 0 &&
                    <span className="m-2 my-6 font-semibold"> {filteredDataRef.current.length} / {dataRef.current.length} Results</span>
                }        
                <div className="bg-white w-screen min-w-screen shadow-md rounded ">
                    <table className="min-w-max w-full table-auto">
                        <thead>
                            <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'> 
                                {renderHeaders()}
                            </tr>                                           
                            
                        </thead>
                        <tbody className="text-gray-600 text-lg font-light">
                            {renderTable()}
                        </tbody>
                    </table>
                    <div className="grid grid-rows-1 grid-cols-4">
                        <div className="col-span-1">
                            {
                                paginationRef.current.length > 0 &&
                                renderLeftArrow()              
                            }
                        </div>
                        <div className="col-span-1">
                            {
                                renderPaginationButtons()
                            }
                        </div>
                        <div className="col-span-1">
                            {
                                paginationRef.current.length > 0 &&
                                renderPaginationNumber()
                            }
                        </div>
                        <div className="col-span-1">
                            {
                                paginationRef.current.length > 0 &&
                                renderRightArrow()
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table;