'use client'
import React from 'react'
import { translations } from '@/app/translations'
import PricingCalculator from './PricingCalculator'

const Plans = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    
    const basic = [
        t.basicFeature1,
        t.basicFeature2,
        t.basicFeature3,
        t.basicFeature4
    ]
    
    const premium = [
        t.premiumFeature1,
        t.premiumFeature2,
        t.premiumFeature3,
        t.premiumFeature4,
        t.premiumFeature5
    ]
    
    const ultimate = [
        t.ultimateFeature1,
        t.ultimateFeature2,
        t.ultimateFeature3,
        t.ultimateFeature4,
        t.ultimateFeature5,
        t.ultimateFeature6
    ]
    
    const family = [
        t.familyFeature1,
        t.familyFeature2,
        t.familyFeature3,
        t.familyFeature4
    ]
    
    const group = [
        t.groupFeature1,
        t.groupFeature2,
        t.groupFeature3,
        t.groupFeature4
    ]
    
    return (
        <div id='events' className={`w-full h-full bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[100px] pb-[51px] flex-col flex items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                {/* All-Inclusive Pricing Message */}
                <div className='text-center mb-12'>
                    <h2 className='text-[#DB1FEB] text-3xl font-bold mb-2'>{t.allInclusivePricing}</h2>
                    <p className='text-white text-xl'>{t.whatYouSeeIsWhatYouPay}</p>
                </div>
                
                {/* Interactive Pricing Calculator */}
                <PricingCalculator locale={locale} />
                
                <div className='bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl w-[303px] px-5 py-[14px] flex gap-2 mt-20'>
                    <button className='bg-white text-[26px] font-semibold px-8 py-4 rounded-xl text-gradnt'><span className='text-gradiant'>{t.monthly}</span> </button>
                    <button className='text-[26px] font-semibold text-white'>{t.yearly}</button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-8 mt-[60px]'>
                    <div className='px-2.5'>
                        <div className='rounded-[20px] p-6 md:py-[31px] md:px-[33px] border'>
                            <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                                <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                                <h1 className='text-white text-[26px] font-semibold'>{t.basicPlan}</h1>
                                <h1 className='text- text-[26px] '>
                                    <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>{t.basicPrice}</span>
                                    <span className='text-white text-[18px] '>{t.perMonth}</span>
                                </h1>
                            </div>
                            <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>{t.basicDesc}</p>
                            <div className='flex flex-col gap-2.5 mt-[34px]'>
                                {basic.map((plan, i) => (
                                    <div key={i} className='flex items-center gap-1.5 text-white'>
                                        <img src="/icons/check.png" alt="" className='' />
                                        {plan}
                                    </div>
                                ))}
                            </div>
                            <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>{t.bookNow} <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </div>
                    </div>
                    <div className='px-2.5'>
                        <div className='rounded-[20px] p-6 md:py-[31px] md:px-[33px] border'>
                            <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                                <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                                <h1 className='text-white text-[26px] font-semibold'>{t.premiumPlan}</h1>
                                <h1 className='text- text-[26px] '>
                                    <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>{t.premiumPrice}</span>
                                    <span className='text-white text-[18px] '>{t.perMonth}</span>
                                </h1>
                            </div>
                            <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>{t.premiumDesc}</p>
                            <div className='flex flex-col gap-2.5 mt-[34px]'>
                                {premium.map((plan, i) => (
                                    <div key={i} className='flex items-center gap-1.5 text-white'>
                                        <img src="/icons/check.png" alt="" className='' />
                                        {plan}
                                    </div>
                                ))}
                            </div>
                            <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>{t.bookNow} <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </div>
                    </div>
                    <div className='px-2.5'>
                        <div className='rounded-[20px] p-6 md:py-[31px] md:px-[33px] border'>
                            <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                                <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                                <h1 className='text-white text-[26px] font-semibold'>{t.ultimatePlan}</h1>
                                <h1 className='text- text-[26px] '>
                                    <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>{t.ultimatePrice}</span>
                                    <span className='text-white text-[18px] '>{t.perMonth}</span>
                                </h1>
                            </div>
                            <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>{t.ultimateDesc}</p>
                            <div className='flex flex-col gap-2.5 mt-[34px]'>
                                {ultimate.map((plan, i) => (
                                    <div key={i} className='flex items-center gap-1.5 text-white'>
                                        <img src="/icons/check.png" alt="" className='' />
                                        {plan}
                                    </div>
                                ))}
                            </div>
                            <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>{t.bookNow} <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </div>
                    </div>
                </div>
                
                {/* Family and Group Plans */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-20'>
                    <div className='px-2.5'>
                        <div className='rounded-[20px] p-6 md:py-[31px] md:px-[33px] border'>
                            <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                                <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                                <h1 className='text-white text-[26px] font-semibold'>{t.familyPlan}</h1>
                                <h1 className='text- text-[26px] '>
                                    <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>{t.familyPrice}</span>
                                    <span className='text-white text-[18px] '>{t.perMonth}</span>
                                </h1>
                            </div>
                            <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>{t.familyDesc}</p>
                            <div className='flex flex-col gap-2.5 mt-[34px]'>
                                {family.map((feature, i) => (
                                    <div key={i} className='flex items-center gap-1.5 text-white'>
                                        <img src="/icons/check.png" alt="" className='' />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>{t.bookNow} <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </div>
                    </div>
                    <div className='px-2.5'>
                        <div className='rounded-[20px] p-6 md:py-[31px] md:px-[33px] border'>
                            <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                                <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                                <h1 className='text-white text-[26px] font-semibold'>{t.groupPlan}</h1>
                                <h1 className='text- text-[26px] '>
                                    <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>{t.groupPrice}</span>
                                    <span className='text-white text-[18px] '>{t.perMonth}</span>
                                </h1>
                            </div>
                            <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>{t.groupDesc}</p>
                            <div className='flex flex-col gap-2.5 mt-[34px]'>
                                {group.map((feature, i) => (
                                    <div key={i} className='flex items-center gap-1.5 text-white'>
                                        <img src="/icons/check.png" alt="" className='' />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>{t.bookNow} <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </div>
                    </div>
                </div>
                
                {/* Hourly & Daily Passes */}
                <div className='w-full mt-20'>
                    <h2 className='text-white text-3xl font-bold text-center mb-10'>{t.hourlyAndDailyPasses}</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
                        <div className='bg-gray-900 rounded-xl p-6 text-center'>
                            <h3 className='text-white text-xl font-bold mb-2'>{t.oneHourPass}</h3>
                            <p className='text-[#23A1FF] text-3xl font-bold mb-1'>{t.oneHourPrice}</p>
                            <p className='text-white text-sm'>{t.unlimitedAccess}</p>
                        </div>
                        <div className='bg-gray-900 rounded-xl p-6 text-center'>
                            <h3 className='text-white text-xl font-bold mb-2'>{t.twoHourPass}</h3>
                            <p className='text-[#23A1FF] text-3xl font-bold mb-1'>{t.twoHourPrice}</p>
                            <p className='text-white text-sm'>{t.unlimitedAccess}</p>
                        </div>
                        <div className='bg-gray-900 rounded-xl p-6 text-center'>
                            <h3 className='text-white text-xl font-bold mb-2'>{t.halfDayPass}</h3>
                            <p className='text-[#23A1FF] text-3xl font-bold mb-1'>{t.halfDayPrice}</p>
                            <p className='text-white text-sm'>{t.fourHoursAccess}</p>
                        </div>
                        <div className='bg-gray-900 rounded-xl p-6 text-center'>
                            <h3 className='text-white text-xl font-bold mb-2'>{t.fullDayPass}</h3>
                            <p className='text-[#23A1FF] text-3xl font-bold mb-1'>{t.fullDayPrice}</p>
                            <p className='text-white text-sm'>{t.allDayAccess}</p>
                        </div>
                        <div className='bg-gray-900 rounded-xl p-6 text-center'>
                            <h3 className='text-white text-xl font-bold mb-2'>{t.weekendPass}</h3>
                            <p className='text-[#23A1FF] text-3xl font-bold mb-1'>{t.weekendPrice}</p>
                            <p className='text-white text-sm'>{t.weekendAccess}</p>
                        </div>
                    </div>
                </div>
                
                {/* Individual Experience Pricing */}
                <div className='w-full mt-20'>
                    <h2 className='text-white text-3xl font-bold text-center mb-10'>{t.individualExperiencePricing}</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.freeRoamingArena}</h3>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.singleSession}</span>
                                <span className='font-bold text-white'>$12</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-300'>{t.twoSessions}</span>
                                <span className='font-bold text-white'>$20</span>
                            </div>
                        </div>
                        
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.ufoSpaceshipCinema}</h3>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.singleSession}</span>
                                <span className='font-bold text-white'>$9</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-300'>{t.twoSessions}</span>
                                <span className='font-bold text-white'>$15</span>
                            </div>
                        </div>
                        
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.vr360}</h3>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.singleSession}</span>
                                <span className='font-bold text-white'>$9</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-300'>{t.twoSessions}</span>
                                <span className='font-bold text-white'>$15</span>
                            </div>
                        </div>
                        
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.vrBattle}</h3>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.singleSession}</span>
                                <span className='font-bold text-white'>$9</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-300'>{t.twoSessions}</span>
                                <span className='font-bold text-white'>$15</span>
                            </div>
                        </div>
                        
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.vrWarrior}</h3>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.singleSession}</span>
                                <span className='font-bold text-white'>$7</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-300'>{t.twoSessions}</span>
                                <span className='font-bold text-white'>$12</span>
                            </div>
                        </div>
                        
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.vrCat}</h3>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.singleSession}</span>
                                <span className='font-bold text-white'>$6</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-300'>{t.twoSessions}</span>
                                <span className='font-bold text-white'>$10</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Group Discounts */}
                <div className='w-full mt-20'>
                    <h2 className='text-white text-3xl font-bold text-center mb-10'>{t.groupDiscounts}</h2>
                    <div className='bg-gray-900 rounded-xl p-8'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            <div className='text-center'>
                                <h3 className='text-white text-xl font-bold mb-3'>5-9 People</h3>
                                <p className='text-[#23A1FF] text-3xl font-bold'>10% OFF</p>
                            </div>
                            <div className='text-center'>
                                <h3 className='text-white text-xl font-bold mb-3'>10-19 People</h3>
                                <p className='text-[#23A1FF] text-3xl font-bold'>15% OFF</p>
                            </div>
                            <div className='text-center'>
                                <h3 className='text-white text-xl font-bold mb-3'>20+ People</h3>
                                <p className='text-[#23A1FF] text-3xl font-bold'>20% OFF</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Special Events */}
                <div className='w-full mt-20'>
                    <h2 className='text-white text-3xl font-bold text-center mb-10'>{t.specialEventPackages}</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.birthdayPackages}</h3>
                            <p className='text-white mb-4'>{t.birthdayPackagesDesc}</p>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.startingPrice}</span>
                                <span className='font-bold text-white'>$249</span>
                            </div>
                            <p className='text-sm text-gray-400 mt-2'>{t.birthdayPackagesIncludes}</p>
                        </div>
                        
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.corporateTeamBuilding}</h3>
                            <p className='text-white mb-4'>{t.corporateTeamBuildingDesc}</p>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.perPerson}</span>
                                <span className='font-bold text-white'>$45</span>
                            </div>
                            <p className='text-sm text-gray-400 mt-2'>{t.corporateTeamBuildingCustomizable}</p>
                        </div>
                        
                        <div className='bg-gray-900 rounded-xl p-6'>
                            <h3 className='text-white text-xl font-bold mb-4'>{t.schoolFieldTrips}</h3>
                            <p className='text-white mb-4'>{t.schoolFieldTripsDesc}</p>
                            <div className='flex justify-between items-center border-b border-gray-700 pb-2 mb-2'>
                                <span className='text-gray-300'>{t.perStudent}</span>
                                <span className='font-bold text-white'>$25</span>
                            </div>
                            <p className='text-sm text-gray-400 mt-2'>{t.teacherChaperonePasses}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Plans
