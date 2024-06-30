# WEB3 CHATAPP 

# Team
| ID | Full name |
| :---: | :---: |
| 20120297 | Nguyễn Quang Huy | 
| 20120324 | Nguyễn Thành Long| 
| 20120335 | Cái Hữu Nghĩa |
| 20120228 | Trần Quốc Trung |
| 20120262 | Khúc Khánh Đăng |

# Introducing project
- A chat app project that uses smart contract to add friend, send message. Create layer 2 to save data.
@theblockchaincoders
- Build your first web3 API start-up, in which you can provide users to upload the NFT to IPFS, and allow them to make API requests to fetch all the IPFS blockchain smart contract data.

## NOTE 
- Khi clone về ae nên:
  + git branch <tên branch của mình> (ví dụ: git branch nghiapro1 để chỉnh sửa có gì còn biết mà return).
  + git switch <tên branch của mình> (ví dụ: git switch nghiapro1)
- Sau khi chỉnh sửa xong ae muốn push:
  + git add .
  + git commit -m "<tên phần mình sửa>" (ví dụ: git commit -m "Thêm nút add friend" (khuyến khích ghi tiếng Anh)).
  + git push --set-upstream origin <tên branch> (ví dụ: git push --set-upstream origin nghiapro1).
- Khi đã clone, ae muốn cập nhật cái mà đồng đội mình vừa hoàn thành.
  + git pull
  + đổi về branch của mình.

## Run chain 
### Software Dependencies  
  - WSL2(nếu là máy window)
  - Go: ^1.21
  - Foundry: ^0.2
  - make: ^3
  - Node: ^20
  - pnpm ^8
  - Docker Desktop
  - Rust(không nhớ có cần không, nhma nếu tại install:foundry trong "Bước 2" mà bị lỗi "cargo" thì ae install sau cũng được)
### Bước 1: lưu ý chạy bằng WSL2 và folder phải clone trên ổ linux
  - Làm theo hướng dẫn tại tuturial: https://docs.celestia.org/developers/optimism-devnet cho tới mục **_Start devnet_** quay lại đọc **_Bước 2_** và không chạy theo Tuturial nữa  

### Bước 2: tại bước Srart devnet chạy theo hướng dẫn sau đây
  - Mở wsl trong thư mục optimism vừa clone:
    + run: **pnpm install:foundry**

    + run: **pnpm check:foundry** (_các lần sau chạy lại chain thì bắt đầu từ bước này_)
      * Nếu terminal báo "_expected version a170021_" thì tạm thời bỏ qua và chạy các bước ở dưới và check mục **(1)** sau devnet-up
      * Nếu báo "_Foundry version matches the expected version._" là thành công
      
    + Mở sẵn Docker Desktop
    + run: **make devnet-up** => trừ "_op_stack_go_builder-1_" còn lại 7/8 image docker chạy là done

    + **(1)** check các yc dưới đây nếu bạn bị dính thông báo "_expected version a170021_" ở trên
      * Mở op-batcher-1 và xem có dòng "_celestia: blob successfully submitted_" hay "_celestia: blob submission failed_"
      * Nếu báo success thì thành công r ^^ 
      * Nếu báo fail quay lại step đầu bước 2 chạy "**curl -L https://foundry.paradigm.xyz | bash**" thay vì  "**pnpm install:foundry**" và chạy lại các bước trên(nếu vẫn dính lỗi expected ver lại tiếp tục bỏ qua)

  - Khi không sử dụng chain nữa:
    + run: **make devnet-down**
    + run: **make devnet-clean**
  - Muốn chạy lại chain quay lại chạy từ "_pnpm check:foundry_"
  
  ### Connect wallet
  - Lưu ý chain phải đang chạy
  - Mở metamask
  - Chọn Thêm mạng
    + Tên mạng : OP DEV
    + URL RPC mới http://localhost:9545
    + ID chuỗi: 901(sau khi nhập URL để xem nó có gợi ý ID không, nếu ko thì chain có vấn đề)
    + Ký hiệu tiền tệ: GAR
  - Nếu không báo lỗi thì lưu mạng lại => thành công
  - Import ví Gen
    + Mở Docker Desktop -> mở L1
    + Kéo lên trên cùng sẽ thấy "**BLOCK_SIGNER_PRIVATE_KEY=** ..."
    + Copy Private key -> vào metamask import ví này vào
    + Sau đó từ ví này chuyển tiền sang ví của ae -> done


## Deploy Dapp to chain
  - Mở file .env và edit theo hướng dẫn trong file
  - Run chain
  - Mở termial tại thư mục chatapp(cmd/powershell) run: **npx hardhat run scripts/deploy.js --network localhost** để chạy
  - Terminal xuất hiện "Contract Address" là chạy thành công.
  - Copy Contract Address, vào file contanst.js và dán vào **ChatAppAddress** là xong.

## Run Code
  - npm run build
  - npm run dev
``` Lưu ý: khi đăng ký tài khoản phải ghi lại Mnemonic đã được generated ở bước đăng ký```
