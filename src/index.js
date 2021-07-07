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
                    <div className="justify-center flex hover:cursor-pointer">
                        <span className="ml-1  text-sm flex space-x-2 hover:cursor-pointer">  <svg height="16" width="16" onClick={() => orderBy(header)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M117.3 0c-5.9 0-10.7 4.8-10.7 10.7v490.7c0 5.9 4.8 10.7 10.7 10.7s10.7-4.8 10.7-10.7V10.7C128 4.8 123.2 0 117.3 0z"/><path d="M231.6 109.8L124.9 3.1c-4.2-4.2-10.9-4.2-15.1 0L3.1 109.8c-4.2 4.2-4.2 10.9 0 15.1 4.2 4.2 10.9 4.2 15.1 0l99.1-99.1 99.1 99.1c2.1 2.1 4.8 3.1 7.6 3.1s5.5-1 7.6-3.1C235.7 120.7 235.7 114 231.6 109.8z"/><path d="M394.7 0c-5.9 0-10.7 4.8-10.7 10.7v490.7c0 5.9 4.8 10.7 10.7 10.7s10.7-4.8 10.7-10.7V10.7C405.3 4.8 400.6 0 394.7 0z"/><path d="M508.9 387.1c-4.2-4.2-10.9-4.2-15.1 0l-99.1 99.1 -99.1-99.1c-4.2-4.2-10.9-4.2-15.1 0s-4.2 10.9 0 15.1l106.7 106.7c2.1 2.1 4.8 3.1 7.6 3.1s5.5-1 7.5-3.1l106.7-106.7C513 398.1 513 391.3 508.9 387.1z"/></svg><span>{header.header}</span></span>
                    </div>
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
                else if(header.type == 'integer')
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 57 57" width="512" height="512"><path d="M55.1 51.9L41.6 37.8c3.5-4.1 5.4-9.4 5.4-14.8 0-12.7-10.3-23-23-23s-23 10.3-23 23 10.3 23 23 23c4.8 0 9.3-1.4 13.2-4.2l13.7 14.2c0.6 0.6 1.3 0.9 2.2 0.9 0.8 0 1.5-0.3 2.1-0.8C56.3 55 56.3 53.1 55.1 51.9zM24 6c9.4 0 17 7.6 17 17s-7.6 17-17 17 -17-7.6-17-17S14.6 6 24 6z"/></svg>
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
                <svg width="32" height="32" onClick={() => {
                    if (page != 0) {
                        setPage((page-1))
                    }   
                }}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M501.3 245.3H36.4l141.8-141.8c4.2-4.2 4.2-10.9 0-15.1 -4.2-4.2-10.9-4.2-15.1 0l-160 160c-4.2 4.2-4.2 10.9 0 15.1l160 160c2.1 2.1 4.8 3.1 7.5 3.1 2.7 0 5.5-1 7.5-3.1 4.2-4.2 4.2-10.9 0-15.1L36.4 266.7h464.9c5.9 0 10.7-4.8 10.7-10.7S507.2 245.3 501.3 245.3z"/></svg>
            </div>   
        )

    }

    const renderRightArrow = ()  => {
        return (
            <div className="hover:cursor-pointer items-center justify-end h-full pr-5 flex" >
                <svg width="32" height="32" onClick={() => {
                    if (page + 1 < paginationRef.current.length) {
                        setPage((page+1))
                    }       
                }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M508.9 248.5l-160-160c-4.2-4.2-10.9-4.2-15.1 0 -4.2 4.2-4.2 10.9 0 15.1l141.8 141.8H10.7C4.8 245.3 0 250.1 0 256s4.8 10.7 10.7 10.7h464.9L333.8 408.5c-4.2 4.2-4.2 10.9 0 15.1 2.1 2.1 4.8 3.1 7.5 3.1 2.7 0 5.5-1 7.5-3.1l160-160C513 259.4 513 252.6 508.9 248.5z"/></svg>
            </div>
        )
    }
    return(
            <div className="p-2 min-w-max">
            {
                filteredDataRef.current.length > 0 &&
                <span className="m-2 my-6 font-semibold w-full"> {filteredDataRef.current.length} / {dataRef.current.length} Results</span>
            }        
            <div className="bg-white w-full shadow-md rounded">
                <table className="w-full table-auto overflow-x-auto bg-white min-w-max">
                    <thead>
                        <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'> 
                            {renderHeaders()}
                        </tr>                                           
                        
                    </thead>
                    <tbody className="text-gray-600 text-lg font-ligh w-full">
                        {renderTable()}

                    </tbody>
                </table>
                <div class="grid grid-cols-4">        
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
    )
}

export default Table;