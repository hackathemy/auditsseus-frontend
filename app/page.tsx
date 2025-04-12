"use client";

import { FileUpload } from "@/components/FileUpload";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  Search as SearchIcon, 
  FileCheck, 
  Wallet, 
  ExternalLink,
  GanttChartSquare,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Web3 관련 타입 정의
type RequestArguments = {
  method: string;
  params?: unknown[];
};

type EthereumEventCallback = (params: unknown) => void;

interface EthereumProvider {
  request: (args: RequestArguments) => Promise<unknown>;
  on: (eventName: string, handler: EthereumEventCallback) => void;
  removeListener: (eventName: string, handler: EthereumEventCallback) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

type EthereumError = {
  code: number;
  message: string;
};

export default function Home() {
  // 활성화된 탭을 관리하는 상태
  const [activeTab, setActiveTab] = useState<string>("nft");
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  // 계정 변경 처리
  const handleAccountsChanged = useCallback((accounts: unknown) => {
    const accountArray = accounts as string[];
    if (!accountArray || accountArray.length === 0) {
      setIsConnected(false);
      setAccount("");
      toast.error("지갑 연결이 해제되었습니다.");
    } else {
      setAccount(accountArray[0]);
      toast.info("계정이 변경되었습니다.", {
        description: `${formatAddress(accountArray[0])}`,
      });
    }
  }, []);

  // 체인 변경 처리
  const handleChainChanged = useCallback((chainIdHex: unknown) => {
    setChainId(chainIdHex as string);
    window.location.reload();
  }, []);

  // 지갑 연결 상태 확인
  useEffect(() => {
    checkIfWalletIsConnected();
    
    if (window.ethereum) {
      // 계정 변경 이벤트 리스너
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // 체인 변경 이벤트 리스너
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  // 메타마스크 연결 확인
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("메타마스크를 설치해주세요!");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setChainId(chainIdHex);
      }
    } catch (error) {
      console.error("지갑 연결 확인 중 오류 발생:", error);
    }
  };

  // 메타마스크 연결
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("메타마스크를 설치해주세요!", {
        description: "이 서비스를 이용하려면 메타마스크 설치가 필요합니다.",
        action: {
          label: "설치하기",
          onClick: () => window.open("https://metamask.io/download/", "_blank")
        },
      });
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setChainId(chainIdHex);
        
        toast.success("지갑이 연결되었습니다!", {
          description: `${formatAddress(accounts[0])}`,
        });
      }
    } catch (error) {
      const ethError = error as EthereumError;
      if (ethError.code === 4001) {
        toast.error("연결이 거부되었습니다.");
      } else {
        console.error(error);
        toast.error("연결 중 오류가 발생했습니다.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // 주소 포맷팅 (0x1234...5678 형태로)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // 네트워크 이름 반환
  const getNetworkName = () => {
    if (!chainId) return null;
    
    const networks: {[key: string]: string} = {
      '0x1': 'Ethereum',
      '0x89': 'Polygon',
      '0xa86a': 'Avalanche',
      '0xa': 'Optimism',
      '0xaa36a7': 'Sepolia',
    };
    
    return networks[chainId] || `Chain ID: ${parseInt(chainId, 16)}`;
  };

  // 감사 기능을 사용하기 위한 연결 필요 상태 확인
  const needsConnection = () => {
    return !isConnected && (activeTab === "nft" || activeTab === "whitepaper");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold">Audit Shield</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            <Button 
              variant={activeTab === "nft" ? "default" : "ghost"} 
              className={`rounded-full text-sm ${activeTab === "nft" ? "bg-blue-400 hover:bg-blue-500 text-slate-900" : "text-slate-300 hover:text-slate-100"}`}
              onClick={() => setActiveTab("nft")}
            >
              NFT Audit
            </Button>
            <Button 
              variant={activeTab === "whitepaper" ? "default" : "ghost"} 
              className={`rounded-full text-sm ${activeTab === "whitepaper" ? "bg-blue-400 hover:bg-blue-500 text-slate-900" : "text-slate-300 hover:text-slate-100"}`}
              onClick={() => setActiveTab("whitepaper")}
            >
              Whitepaper Audit
            </Button>
            <Button 
              variant={activeTab === "search" ? "default" : "ghost"} 
              className={`rounded-full text-sm ${activeTab === "search" ? "bg-blue-400 hover:bg-blue-500 text-slate-900" : "text-slate-300 hover:text-slate-100"}`}
              onClick={() => setActiveTab("search")}
            >
              Search
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            {isConnected && (
              <div className="hidden md:flex items-center gap-1 bg-slate-900 rounded-full py-1 px-3 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-slate-300">{getNetworkName()}</span>
                <span className="text-xs text-slate-400">{formatAddress(account)}</span>
              </div>
            )}
            <Button 
              variant={isConnected ? "outline" : "default"}
              className={`rounded-full text-sm ${isConnected 
                ? "border-blue-500 text-blue-400" 
                : "bg-blue-400 hover:bg-blue-500 text-slate-900"}`}
              onClick={connectWallet}
              disabled={isConnecting}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting 
                ? "연결 중..." 
                : isConnected 
                  ? "연결됨" 
                  : "지갑 연결하기"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 탭 내비게이션 (모바일) */}
        <div className="flex md:hidden overflow-x-auto pb-2 mb-4">
          <Button 
            variant={activeTab === "nft" ? "default" : "ghost"} 
            className={`rounded-full text-sm whitespace-nowrap ${activeTab === "nft" ? "bg-blue-400 hover:bg-blue-500 text-slate-900" : ""}`}
            onClick={() => setActiveTab("nft")}
          >
            NFT Audit
          </Button>
          <Button 
            variant={activeTab === "whitepaper" ? "default" : "ghost"} 
            className={`rounded-full text-sm ml-2 whitespace-nowrap ${activeTab === "whitepaper" ? "bg-blue-400 hover:bg-blue-500 text-slate-900" : ""}`}
            onClick={() => setActiveTab("whitepaper")}
          >
            Whitepaper Audit
          </Button>
          <Button 
            variant={activeTab === "search" ? "default" : "ghost"} 
            className={`rounded-full text-sm ml-2 whitespace-nowrap ${activeTab === "search" ? "bg-blue-400 hover:bg-blue-500 text-slate-900" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            Search
          </Button>
        </div>

        {/* 지갑 연결 필요 상태 */}
        {needsConnection() && (
          <div className="max-w-3xl mx-auto mb-8">
            <Card className="shadow-lg border border-blue-900/30 overflow-hidden bg-blue-900/10">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-4">
                <div className="rounded-full bg-blue-900/20 p-3">
                  <AlertCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold text-slate-200 mb-1">지갑 연결이 필요합니다</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    감사 서비스를 이용하려면 메타마스크를 연결해주세요.
                  </p>
                  <Button 
                    className="bg-blue-400 hover:bg-blue-500 text-slate-900 rounded-full"
                    onClick={connectWallet}
                    disabled={isConnecting}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {isConnecting ? "연결 중..." : "지갑 연결하기"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* NFT 이미지 감사 탭 */}
        {activeTab === "nft" && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                NFT Image Audit Service
              </h2>
              <p className="text-lg text-slate-400">
                AI가 NFT 이미지를 분석하여 독창성과 저작권 침해 여부를 확인합니다
              </p>
            </div>

            {!needsConnection() && (
              <>
                <Card className="shadow-lg border border-slate-700 overflow-hidden bg-slate-800">
                  <div className="bg-gradient-to-r from-blue-500/10 to-emerald-400/10 p-4 border-b border-slate-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <ImageIcon className="h-5 w-5 text-blue-400 mr-2" />
                        <h3 className="text-lg font-semibold">NFT 이미지 업로드</h3>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center text-xs font-medium text-slate-400 bg-slate-900 rounded-full px-3 py-1 border border-slate-700">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          AI 분석 지원
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 md:p-8 bg-slate-800">
                    <FileUpload />
                  </CardContent>
                </Card>

                <div className="mt-12 grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                      <FileCheck className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">독창성 검증</h3>
                    <p className="text-slate-400 text-sm">
                      AI가 NFT 이미지의 독창성을 평가하고 유사 작품과 비교 분석합니다.
                    </p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                      <ShieldCheck className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">저작권 검사</h3>
                    <p className="text-slate-400 text-sm">
                      글로벌 데이터베이스와 대조하여 저작권 침해 가능성을 진단합니다.
                    </p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                      <ExternalLink className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">인증서 발급</h3>
                    <p className="text-slate-400 text-sm">
                      검증된 NFT에 대한 인증서를 블록체인에 기록하여 영구 보존합니다.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 백서 감사 탭 */}
        {activeTab === "whitepaper" && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Whitepaper Audit Service
              </h2>
              <p className="text-lg text-slate-400">
                AI가 코인 백서의 내용을 분석하여 신뢰성과 표절 여부를 검증합니다
              </p>
            </div>

            {!needsConnection() && (
              <>
                <Card className="shadow-lg border border-slate-700 overflow-hidden bg-slate-800">
                  <div className="bg-gradient-to-r from-blue-500/10 to-emerald-400/10 p-4 border-b border-slate-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-400 mr-2" />
                        <h3 className="text-lg font-semibold">백서 업로드</h3>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center text-xs font-medium text-slate-400 bg-slate-900 rounded-full px-3 py-1 border border-slate-700">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          PDF 분석
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 md:p-8 bg-slate-800">
                    <FileUpload />
                  </CardContent>
                </Card>

                <div className="mt-12 grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">표절 검사</h3>
                    <p className="text-slate-400 text-sm">
                      AI가 백서의 내용을 분석하여 다른 프로젝트와의 유사성을 검사합니다.
                    </p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                      <GanttChartSquare className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">로드맵 분석</h3>
                    <p className="text-slate-400 text-sm">
                      프로젝트 로드맵의 실현 가능성과 구체성을 평가합니다.
                    </p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                      <ShieldCheck className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">신뢰성 인증</h3>
                    <p className="text-slate-400 text-sm">
                      검증된 백서에 대한 신뢰성 인증을 발급하여 투자자 신뢰를 높입니다.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 검색 탭 */}
        {activeTab === "search" && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Audit Search
              </h2>
              <p className="text-lg text-slate-400">
                NFT 이미지나 프로젝트 정보를 검색하여 이미 분석된 결과를 확인하세요
              </p>
            </div>

            <Card className="shadow-lg border border-slate-700 overflow-hidden bg-slate-800">
              <div className="bg-gradient-to-r from-blue-500/10 to-emerald-400/10 p-4 border-b border-slate-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <SearchIcon className="h-5 w-5 text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold">감사 결과 검색</h3>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 md:p-8 bg-slate-800">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="NFT 컬렉션 이름, 토큰 주소, 프로젝트명 등을 입력하세요" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-200 placeholder-slate-500" 
                    />
                    <SearchIcon className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
                  </div>
                  <Button className="bg-blue-400 hover:bg-blue-500 text-slate-900 rounded-lg">
                    검색
                  </Button>
                </div>
                
                <div className="mt-8 text-center text-slate-400">
                  <p>검색 결과가 여기에 표시됩니다</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                  <ImageIcon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">NFT 검색</h3>
                <p className="text-slate-400 text-sm">
                  NFT 컬렉션 이름이나 토큰 주소로 이미 분석된 결과를 확인합니다.
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">백서 검색</h3>
                <p className="text-slate-400 text-sm">
                  프로젝트명이나 토큰명으로 백서 분석 결과를 조회합니다.
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">인증 내역</h3>
                <p className="text-slate-400 text-sm">
                  인증된 프로젝트 및 NFT 목록을 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-700 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ShieldCheck className="h-5 w-5 text-blue-400 mr-2" />
              <p className="text-sm text-slate-400">
                © 2025 Audit Shield. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">이용약관</a>
              <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">개인정보처리방침</a>
              <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">문의하기</a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
